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

  constructor(test: boolean = false) {
    log.info('Initialize MySQL Connection');
    if (test) {
      return;
    }
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

  getEmailToken() {
    return EmailToken;
  }

  getSession() {
    return Session;
  }

  getLibrary() {
    return Library;
  }

  getVolunteer() {
    return Volunteer;
  }

  getUsers() {
    return Users;
  }
}

let database: Database;

const getDatabase = (test: boolean = false) => {
  if (!database) { database = new Database(test); }
  return database;
};

export default getDatabase;
