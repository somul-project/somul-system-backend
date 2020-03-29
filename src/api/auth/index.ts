import passport from 'passport';
import googlePassport from 'passport-google-oauth20';
import localPassport from 'passport-local';
import githubPassport from 'passport-github';
import express from 'express';
import * as constants from '../../common/constants';
import getDatabase from '../../database';
import * as authHandler from './authHandler';

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
    });
  }
  return done(false, null);
}));

passport.use(new GoogleStrategy({
  clientID: constants.GOOGLE_CLIENT_ID,
  clientSecret: constants.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://${constants.DOMAIN}:${constants.SERVER_PORT}/auth/google/callback`,
},
async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails![0].value;
  const userInfo = await Users.findOne({ where: { email } });
  const user = {
    ...profile,
    email,
    admin: (userInfo) ? false : undefined,
  };
  return cb(undefined, user);
}));

passport.use(new GithubStrategy({
  clientID: constants.GITHUB_CLIENT_ID,
  clientSecret: constants.GITHUB_CLIENT_SECRET,
  callbackURL: `http://${constants.DOMAIN}:${constants.SERVER_PORT}/auth/github/callback`,
  scope: ['user:email'],
},
async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails![0].value;
  const userInfo = await Users.findOne({ where: { email } });
  const user = {
    ...profile,
    email,
    admin: (userInfo) ? false : undefined,
  };
  return cb(undefined, user);
}));

router.use(passport.initialize());
router.use(passport.session());
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
    successRedirect: '/',
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
    successRedirect: '/',
  }));

/**
 * @swagger
 * /auth/login:
 *    post:
 *      tags:
 *          - Login
 *      summary: local login.
 *      consumes:
 *        - multipart/form-data
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
 *          description: '{ result: number, errorCode: number, errorMessage: string }'
 */
router.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
  (req, res) => {
    res.redirect('/');
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
 *          description: '{ result: number, errorCode: number, errorMessage: string }'
 */
router.get('/logout', (req, res) => {
  req.logout();
  res.send({ result: 0 });
});

router.get('/verify/register', authHandler.verifyRegisterHandler);

/**
 * @swagger
 * /auth/register:
 *    post:
 *      tags:
 *          - Register
 *      summary: register
 *      consumes:
 *        - multipart/form-data
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
 *          description: '{ result: number, errorCode: number, errorMessage: string }'
 */
router.post('/register', authHandler.registerHandler);

/**
 * @swagger
 * /auth/secession:
 *    post:
 *      tags:
 *          - Register
 *      summary: secession
 *      responses:
 *        200:
 *          description: '{ result: number, errorCode: number, errorMessage: string }'
 */
router.get('/secession', authHandler.secessionHandler);

router.post('/verify/reset_password', authHandler.verifyResetPwdHandler);

/**
 * @swagger
 * /auth/reset_password:
 *    post:
 *      tags:
 *          - Reset password
 *      summary: request to reset password
 *      consumes:
 *        - multipart/form-data
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
 *          description: '{ result: number, errorCode: number, errorMessage: string }'
 */
router.post('/reset_password', authHandler.resetPwdHandler);

export default router;
