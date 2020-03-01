import * as express from "express";
import * as constants from "../common/constants";
import { Logger } from "../common/logger";
import * as session from "express-session";
import * as  bodyParser from 'body-parser';
import getGraphQlserver from "../api/graphql";

const log = Logger.createLogger("server.server");
const loginRouter = require('../api/login');

export class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
  }
  public async start() {
    await this.addEvent();
    this.app.listen(constants.SERVER_PORT, 
      () => log.info(`Example app listening on port ${constants.SERVER_PORT}!`))
  }
  public authenticateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.session)
    if (req.session && req.session.passport && req.session.passport.user !== undefined) {
      if (req.session.passport.user.admin === undefined) {
        res.send({code: -2});
      } else {
        next();
      }
    } else {
      res.send({code: -1});
    }
  };

  private async addEvent() {
    this.app.use(bodyParser.json()); 
    this.app.use(bodyParser.urlencoded({ extended: true })); 
    this.app.use(session({
      secret: constants.SECRET_CODE,
      cookie: { maxAge: 60 * 60 * 1000 },
      resave: true,
      saveUninitialized: false
    }));

    this.app.get('/', this.authenticateUser , async (req, res, next) => {
      res.send({result: 0});
    });

    this.app.use('/login', loginRouter);
    const graphQlserver = await getGraphQlserver();
    this.app.use("/graphql", graphQlserver);
  }
}