import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import { isCelebrateError } from 'celebrate';
import AppError from '../errors';

const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const {
    statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    message,
  } = err;

  if (isCelebrateError(err)) {
    const errors: any = {};

    err.details.forEach((value) => {
      value.details.forEach((error) => {
        if (error?.context?.key) {
          errors[`${error?.context?.key}`] = error.message;
        }
      });
    });

    res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Ошибка валидации', errors });
  }

  res.status(statusCode).send({
    message: statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });

  next();
};

export default globalErrorHandler;
