import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

export const createUser = async (req: Request, res: Response) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (typeof password !== 'string') {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Пароль должен быть строкой' });
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
        return res
          .status(constants.HTTP_STATUS_CONFLICT)
          .send({ message: 'Пользователь с таким email уже зарегистрирован' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Ошибка валидации данных в запросе' });
      }
      return res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error('Ошибка конфигурации JWT');
  }

  return User.findUserByCredentials(email, password)
    .then((user: IUser) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7 days',
      });
      res.send({ token });
    })
    .catch((err) => res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: err.message }));
};
