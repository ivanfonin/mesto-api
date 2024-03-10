import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import User from '../models/user';
import { AuthRequest } from '../middlewares/auth';
import { AuthError, NotFoundError, RequestError } from '../errors';

export const getAuthUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { user } = req;

  if (user && '_id' in user) {
    const id = user._id;
    try {
      const authUser = await User.findById(id).orFail();
      return res.status(constants.HTTP_STATUS_OK).send(authUser);
    } catch (err) {
      if (err instanceof mongoose.Error.CastError) {
        return next(new RequestError('Не корректный id пользователя'));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с указанным id не найден'));
      }
      return next(new Error('На сервере произошла ошибка'));
    }
  } else {
    return next(new AuthError('Необходима авторизация'));
  }
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).orFail();
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new RequestError('Не корректный id пользователя'));
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError('Пользователь с указанным id не найден'));
    }
    return next(new Error('На сервере произошла ошибка'));
  }
};

type TUpdateUserAction = 'info' | 'avatar';

const updateUser = (action: TUpdateUserAction) => async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    let fields: {
      name?: string,
      about?: string,
      avatar?: string,
    } = {};

    if (action === 'info') {
      const { name, about } = req.body;
      fields = { name, about };
    } else if (action === 'avatar') {
      const { avatar } = req.body;
      fields = { avatar };
    }

    const user = await User.findByIdAndUpdate(req.user?._id, fields, { new: true }).orFail();
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new RequestError('Ошибка валидации данных профиля'));
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError('Пользователь с указанным id не найден'));
    }
    return next(new Error('На сервере произошла ошибка'));
  }
};

export const patchUser = updateUser('info');
export const patchAvatar = updateUser('avatar');
