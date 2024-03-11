import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import { isCelebrateError } from 'celebrate';
import { AppError } from '../errors';

type TErrorResponse = {
  statusCode: number;
  message: string;
  errors?: { [key: string]: string };
}

const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const {
    statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    message,
  } = err;

  const response: TErrorResponse = {
    statusCode,
    message: statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  };

  if (isCelebrateError(err)) {
    const errors: any = {};

    err.details.forEach((value) => {
      value.details.forEach((error) => {
        if (error?.context?.key) {
          errors[`${error?.context?.key}`] = error.message;
        }
      });
    });

    response.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    response.message = 'Ошибка валидации';
    response.errors = errors;
  }

  res.status(statusCode).send(response);

  next();
};

export default globalErrorHandler;
