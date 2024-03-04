import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import AppError from '../errors';

const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const {
    statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    message,
  } = err;

  res.status(statusCode).send({
    message: statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });

  next();
};

export default globalErrorHandler;
