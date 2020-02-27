import * as express from "express";
import * as constants from "../common/constants";
import { Logger } from "../common/logger";
import * as session from "express-session";
import * as  bodyParser from 'body-parser';
import { User } from "../database/user.model";
// import * as sendgrid from "../common/sendgrid";

const loginRouter = require('../api/login');
const emailRouter = require('../api/email');
const graphqlRouter = require('../api/graphql');

const log = Logger.createLogger("server.server");

export class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
  }
  public start() {
    this.addEvent();
    this.app.listen(constants.SERVER_PORT, 
      () => log.info(`Example app listening on port ${constants.SERVER_PORT}!`))
  }
  public authenticateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session && req.session.passport && req.session.passport.user !== undefined) {
      if (req.session.passport.user.admin === undefined) {
        res.render("infomation.html");

        // res.send({code: -2});
      } else {
        next();
      }
    } else {
      res.send({code: -1});
    }
  };

  private addEvent() {
    this.app.use(bodyParser.json()); 
    this.app.use(bodyParser.urlencoded({ extended: true })); 
    this.app.use(session({
      secret: constants.SECRET_CODE,
      cookie: { maxAge: 60 * 60 * 1000 },
      resave: true,
      saveUninitialized: false
    }));
    this.app.use('/login', loginRouter);
    this.app.use('/graphql', this.authenticateUser, graphqlRouter);
    this.app.use('/email', this.authenticateUser, emailRouter);
    this.app.set('view engine', 'ejs');
    this.app.engine('html', require('ejs').renderFile);
    

    this.app.get('/', this.authenticateUser , async (req, res, next) => {
      res.send({result: 0});
    });
    this.app.get('/info', async (req, res, next) => {
      res.render("infomation.html");
    });
    this.app.get('/local_login', async (req, res, next) => {
      res.render("local_login.html");
    });
    this.app.get('/reg', async (req, res, next) => {
      res.render("register.html");
    });
    
    this.app.post('/register', async (req, res, next) => {
      const info = req.body;
      let user;
      if (req.session && req.session.passport &&req.session.passport.user !== undefined) {
      // OAuth
        user = User.build({
          email: req.session.passport.user!["email"],
          name: info.name,
          phone_number: info.phone_number,
          admin: false,
        });
      } else {
        // local
        // @TODO verify email.
        user = User.build({
          email: info.email,
          password: info.password,
          name: info.name,
          phone_number: info.phone_number,
          admin: false,
        });
      }
      try {
        await user.save();
        res.send({result: 0});
      } catch (e) {
        res.send({result: -1, error: e});
      }
    });
  }
}
