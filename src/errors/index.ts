import RequestError from './RequestError';
import AuthError from './AuthError';
import ForbiddenError from './ForbiddenError';
import NotFoundError from './NotFoundError';
import ConflictError from './ConflictError';

interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export {
  AppError,
  RequestError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
