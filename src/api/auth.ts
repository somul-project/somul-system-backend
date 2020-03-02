import * as passport from "passport";
import * as googlePassport from 'passport-google-oauth20';
import * as localPassport from "passport-local";
import * as githubPassport from "passport-github";
import * as constants from "../common/constants";
import { Users } from "../database/models/Users.model";
import { EmailToken } from "../database/models/EmailToken.model";
import * as express from "express";
import sha256 from "sha256";

const router = express.Router();
const LocalStrategy = localPassport.Strategy;
const GoogleStrategy = googlePassport.Strategy;
const GithubStrategy = githubPassport.Strategy;

passport.serializeUser(async (user: object, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	},
	async (req, email, password, done) => {
		const userInfo = await Users.findOne({where: {email, password: sha256(password)}});
		if(userInfo){
			return done(null, {
				email,
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
  async (accessToken, refreshToken, profile, cb) => {
		const email = profile.emails![0].value;
    const userInfo = await Users.findOne({where: {email}});
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
	async (accessToken, refreshToken, profile, cb) => {
		const email = profile.emails![0].value;		
		const userInfo = await Users.findOne({where: {email}});
		if (userInfo) {
			process["admin"] = userInfo.getDataValue("admin");
		}
		profile["email"] = email;
		return cb(undefined, profile);
	}
));

router.use(passport.initialize());
router.use(passport.session());

router.get("/verify_email", async (req, res) => {
  try {
    const email = req.query.email;
    const result = await EmailToken.findOne({
      where: {...req.query}});
    if (result) {
      await EmailToken.destroy({
        where: {email}
      })
      await Users.build({
        email: result.email,
        name: result.name,
        phone_number: result.phone_number,
        admin: false,
        password: result.password
      }).save();
    } else {
      throw "invalid request";
    }
    res.send("성공")
  } catch (error){
    res.send({result: -1, error});
  }
})
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/auth/google',
    successRedirect: '/'
  }
));
router.get("/github", passport.authenticate('github', { scope: ['profile', 'user:email'] }))
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/github',
    successRedirect: '/'
  }
));

router.post('/login', passport.authenticate('local', {failureRedirect: '/', failureFlash: true}),
  (req, res) => {
    res.redirect('/');
  }
);

router.post('/logout', (req, res) => {
		req.logout();
	}
);

export default router;