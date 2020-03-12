import passport from 'passport';
import googlePassport from 'passport-google-oauth20';
import localPassport from 'passport-local';
import githubPassport from 'passport-github';
import express from 'express';
import * as constants from '../common/constants';
import Users from '../database/models/Users.model';
import EmailToken from '../database/models/EmailToken.model';
import sendgrid, { VERIFY_TEMPLATE, RESET_TEMPLATE } from '../util/sendgrid';

const randomstring = require('randomstring');
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

router.get('/verify', async (req, res) => {
  try {
    const { email } = req.query;
    const result = await EmailToken.findOne({ where: { ...req.query } });
    if (result) {
      await EmailToken.destroy({
        where: { email },
      });
      await Users.update({
        verify_email: true,
      }, {
        where: { email: result.email },
      });
    } else {
      throw new Error('1');
    }
    res.send({ result: 0 });
  } catch (error) {
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    res.send({ result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] });
  }
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
 *          description: Receive back flavor and flavor Id.
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
 *          description: Receive back flavor and flavor Id.
 */
router.get('/logout', (req, res) => {
  req.logout();
  res.send({ result: 0 });
});

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
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *               type: string?
 *              password:
 *                type: string?
 *              phonenumber:
 *                type: string
 *              name:
 *                type: string
 *      responses:
 *        200:
 *          description: Receive back flavor and flavor Id.
 */
router.post('/register', async (req, res) => {
  const verify_email = !!(req.session && req.session.passport);
  const PassportEmail = (req.session
    && req.session.passport) ? req.session!.passport.user.email : undefined;
  const {
    email,
    name,
    phonenumber,
    password,
  } = req.body;
  try {
    const result = await Users.findOne({ where: { email } });
    if (result) {
      throw new Error('102');
    }
    await Users.build({
      email: (verify_email) ? PassportEmail : email,
      name,
      phonenumber,
      admin: false,
      verify_email,
      password: (password) ? sha256(password) : undefined,
    }).save();
    // local register
    if (!verify_email) {
      const token = randomstring.generate();
      await EmailToken.build({
        email,
        token,
      }).save();
      // send email for verifying
      sendgrid({
        from: constants.ADMIN_EMAIL,
        to: email,
        subject: VERIFY_TEMPLATE.subject,
        text: VERIFY_TEMPLATE.html.replace('{token}', token).replace('{email}', email),
      });
    }
    res.send({ result: 0 });
  } catch (error) {
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    res.send({ result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] });
  }
});

/**
 * @swagger
 * /auth/secession:
 *    post:
 *      tags:
 *          - Register
 *      summary: secession
 *      responses:
 *        200:
 *          description: Receive back flavor and flavor Id.
 */
router.post('/secession', async (req, res) => {
  const PassportEmail = (req.session
    && req.session.passport) ? req.session!.passport.user.email : undefined;
  try {
    if (PassportEmail) {
      await Users.destroy({
        where: { email: PassportEmail },
      });
    } else {
      throw new Error('1');
    }
  } catch (error) {
    const errorCode = (constants.ERROR_MESSAGE[error]) ? error : 500;
    res.send({ result: -1, errorCode, errorMessage: constants.ERROR_MESSAGE[errorCode] });
  }
});

router.post('/resetPwd', async (req, res) => {
  const { password } = req.body;

  try {
    const result = await EmailToken.findOne({ where: { ...req.query } });
    if (result) {
      await EmailToken.destroy({
        where: { email: result.email },
      });
    } else {
      res.send({ result: -1 });
      return;
    }
    await Users.update({
      password: sha256(password),
    }, {
      where: { email: result.email },
    });
    res.send({ result: 0 });
  } catch (error) {
    res.send({ result: -1, errorCode: 103, errorMessage: constants.ERROR_MESSAGE[103] });
  }
});

/**
 * @swagger
 * /auth/request_resetPwd:
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
 *          description: Receive back flavor and flavor Id.
 */
router.post('/request_resetPwd', async (req, res) => {
  const {
    email,
  } = req.body;
  try {
    const token = randomstring.generate();
    await EmailToken.build({
      email,
      token,
    }).save();
    sendgrid({
      from: constants.ADMIN_EMAIL,
      to: email,
      subject: RESET_TEMPLATE.subject,
      html: RESET_TEMPLATE.html.replace('{token}', token).replace('{email}', email),
    });
    res.send({ result: 0 });
  } catch (error) {
    res.send({ result: -1, errorCode: 103, errorMessage: constants.ERROR_MESSAGE[103] });
  }
});

export default router;
