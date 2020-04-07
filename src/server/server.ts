import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import * as constants from '../common/constants';
import * as errorHandler from '../common/error';
import Logger from '../common/logger';
import getGraphQlserver from '../api/graphql';
import authRouter from '../api/auth';
import * as specs from './swagger';
import Slack from '../util/slack';

const log = Logger.createLogger('server.server');

export default class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
  }

  public async start() {
    await this.addEvent();
    this.app.listen(constants.SERVER_PORT,
      async () => {
        log.info(`Example app listening on port ${constants.SERVER_PORT}!`);
        await Slack.send('info', `Example app listening on port ${constants.SERVER_PORT}!`);
      });
  }

  public authenticateUser = async (req: express.Request,
    res: express.Response, next: express.NextFunction) => {
    if (req.session && req.session.passport && req.session.passport.user !== undefined) {
      if (req.session.passport.user.admin === undefined) {
        res.send({ statusCode: '105', errorMessage: errorHandler.CustomError.MESSAGE['105'] });
      } else {
        next();
      }
    } else {
      res.send({ statusCode: '104', errorMessage: errorHandler.CustomError.MESSAGE['104'] });
    }
  }

  private async addEvent() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(session({
      secret: constants.SECRET_CODE,
      cookie: { maxAge: 60 * 60 * 1000 },
      resave: true,
      saveUninitialized: false,
    }));

    this.app.get('/', this.authenticateUser, async (req, res) => {
      res.send({ statusCode: '0' });
    });
    this.app.use('/auth', authRouter);
    const graphQlserver = await getGraphQlserver();

    /**
     * @swagger
     * /graphql:
     *    post:
     *      tags:
     *          - graphql
     *      summary: graphql.
     *      consumes:
     *        - application/json
     */
    this.app.use('/graphql', this.authenticateUser, graphQlserver);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs.default));
  }
}
