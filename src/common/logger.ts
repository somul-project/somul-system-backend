import * as winston from "winston";

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

/*
  records only debug log and error log.
  log file name is time that server start.
*/
export class Logger {

  static createLogger(label: string): winston.Logger {
    return winston.createLogger({
      format:  winston.format.combine(
        winston.format.label({ label }),
        winston.format.timestamp(),
        myFormat,
      ),
      transports: [
        new (winston.transports.Console)({
          level: 'debug'}),
      ]
    });
  }
}
