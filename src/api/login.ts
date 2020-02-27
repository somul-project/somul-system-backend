import * as passport from "passport";
import * as googlePassport from 'passport-google-oauth20';
import * as localPassport from "passport-local";
import * as githubPassport from "passport-github";
import * as constants from "../common/constants";
import * as express from "express";
import { User } from "../database/user.model";

const router = express.Router();
const LocalStrategy = localPassport.Strategy;
const GoogleStrategy = googlePassport.Strategy;
const GithubStrategy = githubPassport.Strategy;

passport.serializeUser(async (user: object, done) => {
	done(null, user); // user객체가 deserializeUser로 전달됨.
});

passport.deserializeUser((user, done) => {
	done(null, user); // 여기의 user가 req.user가 됨
});

passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true,
	},
	async function(req, username, password, done) {
		const userInfo = await User.findOne({where: {email: username, password}});
		if(userInfo){
			return done(null, {
				email: username,
				admin: userInfo?.getDataValue("admin")
			});
		} else{
			return done(false, null)
		}
	}
));

passport.use(new GoogleStrategy({
		clientID: constants.GOOGLE_CLIENT_ID,
		clientSecret: constants.GOOGLE_CLIENT_SECRET,
		callbackURL: `http://localhost:${constants.SERVER_PORT}/login/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {
		const email = profile.emails![0].value;
		const userInfo = await User.findOne({where: {email}});
		if (userInfo) {
			profile["admin"] = userInfo.getDataValue("admin");
		}
		profile["email"] = email;
    return cb(undefined, profile);
  }
));

passport.use(new GithubStrategy({
		clientID: constants.GITHUB_CLIENT_ID,
		clientSecret: constants.GITHUB_CLIENT_SECRET,
		callbackURL: `http://localhost:${constants.SERVER_PORT}/login/github/callback`,
		scope: [ 'user:email' ]
	},
	async function(accessToken, refreshToken, profile, cb) {
		const email = profile.emails![0].value;		
		const userInfo = await User.findOne({where: {email}});
		if (userInfo) {
			process["admin"] = userInfo.getDataValue("admin");
		}
		profile["email"] = email;
		return cb(undefined, profile);
	}
));

router.use(passport.initialize());
router.use(passport.session());

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', 
	passport.authenticate('google', {
		failureRedirect: '/login/google',
		successRedirect: '/'
	}
));

router.get("/github", passport.authenticate('github', { scope: ['profile', 'user:email'] }))
router.get('/github/callback',
	passport.authenticate('github', {
		failureRedirect: '/login/github',
		successRedirect: '/'
	}
));

router.post('/local', passport.authenticate('local', {failureRedirect: '/local_register_render', failureFlash: true}),
	(req, res) => {
		res.redirect('/');
	}
);

module.exports = router;
