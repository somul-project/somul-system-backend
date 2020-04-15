import passport from 'passport';
import googlePassport from 'passport-google-oauth20';
import localPassport from 'passport-local';
import githubPassport from 'passport-github';
import express from 'express';
import * as constants from '../../common/constants';
import getDatabase from '../../database';
import AuthHandler from './authHandler';
import * as errorHandler from '../../common/error';

const Users = getDatabase().getUsers();

const sha256 = require('sha256');

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
  const userInfo = await Users.findOne({ where: { email, password: sha256(password) } });
  if (userInfo && userInfo.verify_email) {
    return done(null, {
      email,
      admin: userInfo?.getDataValue('admin'),
      name: userInfo.name,
      phonenumber: userInfo.phonenumber,
    });
  }
  return done(false, null);
}));

passport.use(new GoogleStrategy({
  clientID: constants.GOOGLE_CLIENT_ID,
  clientSecret: constants.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://${constants.SERVER_DOMAIN}:${constants.SERVER_PORT}/auth/google/callback`,
},
async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails![0].value;
  const userInfo = await Users.findOne({ where: { email } });
  const user = {
    ...profile,
    email,
    admin: (userInfo) ? false : undefined,
    name: (userInfo) ? userInfo.name : undefined,
    phonenumber: (userInfo) ? userInfo.phonenumber : undefined,
  };
  return cb(undefined, user);
}));

passport.use(new GithubStrategy({
  clientID: constants.GITHUB_CLIENT_ID,
  clientSecret: constants.GITHUB_CLIENT_SECRET,
  callbackURL: `http://${constants.SERVER_DOMAIN}:${constants.SERVER_PORT}/auth/github/callback`,
  scope: ['user:email'],
},
async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails![0].value;
  const userInfo = await Users.findOne({ where: { email } });
  const user = {
    ...profile,
    email,
    admin: (userInfo) ? false : undefined,
    name: (userInfo) ? userInfo.name : undefined,
    phonenumber: (userInfo) ? userInfo.phonenumber : undefined,
  };
  return cb(undefined, user);
}));

router.use(passport.initialize());
router.use(passport.session());


router.get('/verify/oauth',
  (req, res) => {
    if (req.session!.passport.user.admin === undefined) {
      res.redirect(`${constants.CLIENT_DOMAIN}/signUp?email=${req.session!.passport.user.email}`);
      return;
    }
    res.redirect(`${constants.CLIENT_DOMAIN}/`);
  });


/**
 * @swagger
 * /auth/google:
 *    get:
 *      tags:
 *          - Login
 *      summary: google OAuth.
 *      description: redirect to google login
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google',
    successRedirect: '/auth/verify/oauth',
  }));

/**
 * @swagger
 * /auth/github:
 *    get:
 *      tags:
 *          - Login
 *      summary: github OAuth.
 *      description: redirect to github login
 */
router.get('/github', passport.authenticate('github', { scope: ['profile', 'user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/github',
    successRedirect: '/auth/verify/oauth',
  }));

/**
 * @swagger
 * /auth/login:
 *    post:
 *      tags:
 *          - Login
 *      summary: local login.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        200:
 *          description: '{ statusCode: string, errorMessage: string }'
 */
router.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
  (req, res) => {
    if (req.session!.passport.user.admin === undefined) {
      res.send({ statusCode: '105', errorMessage: errorHandler.CustomError.MESSAGE['105'] });
      return;
    }
    res.send({ statusCode: '0' });
  });

/**
 * @swagger
 * /auth/logout:
 *    get:
 *      tags:
 *          - logout
 *      summary: logout.
 *      responses:
 *        200:
 *          description: '{ statusCode: string, errorMessage: string }'
 */
router.get('/logout', (req, res) => {
  req.logout();
  res.send({ result: 0 });
});

router.get('/verify/register', AuthHandler.verifyRegisterHandler);

/**
 * @swagger
 * /auth/register:
 *    post:
 *      tags:
 *          - Register
 *      summary: register
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: 'you have to send only name and phonenumber then you register using OAuth.'
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *               type: string
 *              password:
 *                type: string
 *              phonenumber:
 *                type: string
 *              name:
 *                type: string
 *      responses:
 *        200:
 *          description: '{ statusCode: string, errorMessage: string }'
 */
router.post('/register', AuthHandler.registerHandler);

/**
 * @swagger
 * /auth/resend:
 *    get:
 *      tags:
 *          - register
 *      summary: request to resend.
 *      responses:
 *        200:
 *          description: '{ statusCode: string, errorMessage: string }'
 */
router.get('/resend', AuthHandler.resendTokenMessage);

/**
 * @swagger
 * /auth/withdraw:
 *    post:
 *      tags:
 *          - Register
 *      summary: withdraw
 *      responses:
 *        200:
 *          description: '{ result: number, errorCode: number, errorMessage: string }'
 */
router.get('/withdraw', AuthHandler.withdrawHandler);

router.post('/verify/reset_password', AuthHandler.verifyResetPwdHandler);

/**
 * @swagger
 * /auth/reset_password:
 *    post:
 *      tags:
 *          - Reset password
 *      summary: request to reset password
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *      responses:
 *        200:
 *          description: '{ statusCode: string, errorMessage: string }'
 */
router.post('/reset_password', AuthHandler.resetPwdHandler);

export default router;
