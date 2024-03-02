import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import NotFoundError from '../errors/NotFoundError';
import RequestError from '../errors/RequestError';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

export const postUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  User.create({
    name,
    about,
    avatar,
  }).then((user) => {
    if (!user) {
      throw new RequestError('Не удалось создать пользователя');
    }
    res.send(user);
  })
    .catch(next);
};

export const patchUser = (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new RequestError('Не удалось обновить данные пользователя');
      }
      res.send(user);
    })
    .catch(next);
};

export const patchAvatar = (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new RequestError('Не удалось обновить аватар');
      }
      res.send(user);
    })
    .catch(next);
};
