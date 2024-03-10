import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ConflictError, RequestError } from '../errors';
import User, { IUser } from '../models/user';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (typeof password !== 'string') {
    return next(new RequestError('Пароль должен быть строкой'));
  }

  const hash = await bcrypt.hash(password, 10);

  return User.create({
    email,
    password: hash,
    name: name || process.env.USER_DEFAULT_NAME,
    about: about || process.env.USER_DEFAULT_ABOUT,
    avatar: avatar || process.env.USER_DEFAULT_AVATAR,
  }).then((user) => res.status(constants.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Ошибка валидации данных пользователя'));
      }
      return next(new Error('На сервере произошла ошибка'));
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    return next(new Error('Ошибка конфигурации JWT'));
  }

  return User.findUserByCredentials(email, password)
    .then((user: IUser) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7 days',
      });
      res.send({ token });
    })
    .catch((err) => next(new Error(err.message)));
};
