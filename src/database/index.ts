import { Sequelize } from 'sequelize-typescript';
import * as constants from '../common/constants';
import Logger from '../common/logger';
import EmailToken from './models/EmailToken.model';
import Session from './models/Session.model';
import Library from './models/Library.model';
import Volunteer from './models/Volunteer.model';
import Users from './models/Users.model';

const log = Logger.createLogger('database.database');

export class Database {
  protected instance: Sequelize;

  constructor() {
    log.info('Initialize MySQL Connection');
    this.instance = new Sequelize(constants.DB_NAME, constants.DB_USERNAME, constants.DB_PASSWORD, {
      host: constants.DB_ENDPOINT,
      dialect: 'mysql',
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
      logging: false,
    });
    this.instance.addModels([EmailToken, Library, Session, Users, Volunteer]);
  }
}

let database: Database;

const getDatabase = () => {
  if (!database) { database = new Database(); }
  return database;
};

export default getDatabase;
