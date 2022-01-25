import winston from 'winston';
import { env } from './environment';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: env.logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} | ${level} | ${message}`;
        })
      )
    })
  ]
});

if (env.logFile) {
  logger.info(`Logs are stored at a custom location : ${env.logFile}`);
  logger.add(
    new winston.transports.File({
      filename: env.logFile,
      level: env.logLevel,
      format: winston.format.json()
    })
  );
} else {
  logger.info('env.logFile is not defined');
  logger.info('Logs are not persisted in a file');
}

export default logger;
