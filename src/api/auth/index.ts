import passport from 'passport';
import googlePassport from 'passport-google-oauth20';
import localPassport from 'passport-local';
import githubPassport from 'passport-github';
import express from 'express';
import * as constants from '../../common/constants';
import AuthHandler from './authHandler';

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
  session: true,
  passReqToCallback: true,
}, AuthHandler.localLogin));

passport.use(new GoogleStrategy({
  clientID: constants.GOOGLE_CLIENT_ID,
  clientSecret: constants.GOOGLE_CLIENT_SECRET,
  callbackURL: `${constants.SERVER_DOMAIN}/auth/google/callback`,
}, AuthHandler.googleLogin));

passport.use(new GithubStrategy({
  clientID: constants.GITHUB_CLIENT_ID,
  clientSecret: constants.GITHUB_CLIENT_SECRET,
  callbackURL: `${constants.SERVER_DOMAIN}/auth/github/callback`,
  scope: ['user:email'],
}, AuthHandler.githubLogin));

router.use(passport.initialize());
router.use(passport.session());


router.get('/verify/local', AuthHandler.verifyLocalLogin);

router.get('/verify/oauth', AuthHandler.verifyOauthLogin);

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
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/auth/verify/local', failureRedirect: '/auth/verify/local', failureFlash: true,
  }));

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
router.get('/logout', AuthHandler.logout);

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
router.post('/register', AuthHandler.register);

router.get('/verify/register', AuthHandler.verifyRegister);

/**
 * @swagger
 * /auth/resend/token:
 *    get:
 *      tags:
 *          - Register
 *      summary: request to resend.
 *      responses:
 *        200:
 *          description: '{ statusCode: string, errorMessage: string }'
 */
router.get('/resend/token', AuthHandler.sendToken);

/**
 * @swagger
 * /auth/withdraw:
 *    get:
 *      tags:
 *          - Register
 *      summary: withdraw
 *      responses:
 *        200:
 *          description: '{ result: number, errorCode: number, errorMessage: string }'
 */
router.get('/withdraw', AuthHandler.withdraw);

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
 *              newPassword:
 *                type: string
 *      responses:
 *        200:
 *          description: '{ statusCode: string, errorMessage: string }'
 */
router.post('/reset_password', AuthHandler.resetPwd);

router.post('/verify/reset_password', AuthHandler.verifyResetPwd);

/**
 * @swagger
 * /auth/get_userInfo:
 *    get:
 *      tags:
 *          - User
 *      summary: request to get user information
 *      responses:
 *        200:
 *          description: '{} || {email: string}
 *            || { email: string, admin: boolean, name: string,
 *                 phonenumber: string, verify_email: boolean,
 *                 statusCode: string, local: boolean }'
 */
router.get('/get_userInfo', AuthHandler.getSessionInfo);

export default router;
