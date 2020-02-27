import * as constants from "../common/constants";
import { Sequelize } from "sequelize-typescript";
import { Logger } from "../common/logger";
import { User } from "./user.model";


const log = Logger.createLogger("database.database");

export class Database {
  protected instance: Sequelize;

  constructor() {
    log.info("Initialize MySQL Connection");
    this.instance = new Sequelize(constants.DB_NAME, constants.DB_USERNAME, constants.DB_PASSWORD, {
      host: constants.DB_ENDPOINT,
      dialect: "mysql",
      define: {
        charset: "utf8",
        collate: "utf8_general_ci",
      },
      logging: false,
    });
    this.instance.addModels([User]);
  }

  public sync() {
    // Before deploy, make sure the model is already applied to server.
    User.sync();
    log.info("Sync finished");
    return this;
  }
}

let database: Database;

export const getDatabase = () => {
  if (!database) { database = new Database(); }
  return database;
};
