import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthError, ConflictError, RequestError } from '../errors';
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
    name,
    about,
    avatar,
  }).then((user) => {
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      __v: user.__v,
    };
    res.status(constants.HTTP_STATUS_CREATED).send(userWithoutPassword);
  })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Не корректные данные пользователя'));
      }
      return next(new Error('На сервере произошла ошибка'));
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { JWT_SECRET = 'super-secret-token' } = process.env;

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
    .catch((err) => {
      if (err instanceof AuthError) {
        return next(new AuthError(err.message));
      }
      return next(new Error(err.message));
    });
};
