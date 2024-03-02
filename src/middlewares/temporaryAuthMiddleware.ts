import { Response, Request, NextFunction } from 'express';

// Временный интерфейс, описивающий свойство user
interface IRequestWithUser extends Request {
  user?: { _id: string; };
}

const temporaryAuthMiddleware = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  req.user = {
    _id: process.env.USER_ID || '',
  };

  next();
};

export default temporaryAuthMiddleware;
