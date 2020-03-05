import * as passport from 'passport';
import * as googlePassport from 'passport-google-oauth20';
import * as localPassport from 'passport-local';
import * as githubPassport from 'passport-github';
import * as express from 'express';
import sha256 from 'sha256';
import * as constants from '../common/constants';
import Users from '../database/models/Users.model';
import EmailToken from '../database/models/EmailToken.model';

const router = express.Router();
const LocalStrategy = localPassport.Strategy;
const GoogleStrategy = googlePassport.Strategy;
const GithubStrategy = githubPassport.Strategy;

const ERROR_MESSAGE = 'invalid request';

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
  const userInfo = await Users.findOne({ where: { email, password: sha256(password) } });
  if (userInfo) {
    return done(null, {
      email,
      admin: userInfo?.getDataValue('admin'),
    });
  }
  return done(false, null);
}));

passport.use(new GoogleStrategy({
  clientID: constants.GOOGLE_CLIENT_ID,
  clientSecret: constants.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:${constants.SERVER_PORT}/login/google/callback`,
},
async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails![0].value;
  const userInfo = await Users.findOne({ where: { email } });
  if (userInfo) {
    Object.defineProperty(profile, 'admin', {
      value: userInfo.getDataValue('admin'),
      writable: false,
    });
  }
  Object.defineProperty(profile, 'email', {
    value: email,
    writable: false,
  });
  return cb(undefined, profile);
}));

passport.use(new GithubStrategy({
  clientID: constants.GITHUB_CLIENT_ID,
  clientSecret: constants.GITHUB_CLIENT_SECRET,
  callbackURL: `http://localhost:${constants.SERVER_PORT}/login/github/callback`,
  scope: ['user:email'],
},
async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails![0].value;
  const userInfo = await Users.findOne({ where: { email } });
  if (userInfo) {
    Object.defineProperty(profile, 'admin', {
      value: userInfo.getDataValue('admin'),
      writable: false,
    });
  }
  Object.defineProperty(profile, 'email', {
    value: email,
    writable: false,
  });
  return cb(undefined, profile);
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/verify', async (req, res) => {
  try {
    const { email } = req.query;
    const result = await EmailToken.findOne({ where: { ...req.query } });
    if (result) {
      await EmailToken.destroy({
        where: { email },
      });
      await Users.build({
        email: result.email,
        name: result.name,
        phonenumber: result.phonenumber,
        admin: false,
        password: result.password,
      }).save();
    } else {
      throw ERROR_MESSAGE;
    }
    res.send({ result: 0 });
  } catch (error) {
    res.send({ result: -1, error });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google',
    successRedirect: '/',
  }));

router.get('/github', passport.authenticate('github', { scope: ['profile', 'user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/github',
    successRedirect: '/',
  }));

router.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
  (req, res) => {
    res.redirect('/');
  });

router.post('/logout', (req) => {
  req.logout();
});

export default router;
