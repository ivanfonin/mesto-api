import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AuthError from '../errors/AuthError';

export interface AuthRequest extends Request {
  user?: String | JwtPayload | undefined;
}

export default (req: AuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const { JWT_SECRET = 'super-secret-token' } = process.env;

  if (!JWT_SECRET) {
    throw new AuthError('Токен обязателен');
  }

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
