import winston from 'winston';
import expressWinston from 'express-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import constants from '../../constants';

const requestTransport = new DailyRotateFile({
  filename: `${constants.ROOT_DIR}/logs/request-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '30 days',
});

const errorTransport = new DailyRotateFile({
  filename: `${constants.ROOT_DIR}/logs/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '30 days',
});

const requestLogger = expressWinston.logger({
  transports: [requestTransport],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [errorTransport],
  format: winston.format.json(),
});

export { requestLogger, errorLogger };
