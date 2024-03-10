import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import bcrypt from 'bcryptjs';
import User from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).orFail();
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Не корректный id пользователя' });
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователь с указанным id не найден' });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const postUser = async (req: Request, res: Response) => {
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
          .status(constants.HTTP_STATUS_BAD_REQUEST)
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

type TUpdateUserAction = 'info' | 'avatar';

const updateUser = (action: TUpdateUserAction) => async (
  req: Request & { user?: { _id: string } },
  res: Response,
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
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Ошибка валидации данных в запросе' });
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователь с указанным id не найден' });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const patchUser = updateUser('info');
export const patchAvatar = updateUser('avatar');
