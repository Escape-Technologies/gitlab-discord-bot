import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
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

if (process.env.LOG_FILE) {
  logger.info(`Logs are stored at a custom location : ${process.env.LOG_FILE}`);
  logger.add(
    new winston.transports.File({
      filename: process.env.LOG_FILE,
      format: winston.format.json()
    })
  );
} else {
  logger.info('process.env.LOG_FILE is not defined');
  logger.info('Logs are not persisted in a file');
}

module.exports = logger;
export default logger;
