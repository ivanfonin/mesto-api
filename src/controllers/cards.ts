import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import { ForbiddenError, NotFoundError, RequestError } from '../errors';
import Card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

export const postCard = (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user?._id,
  }).then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Ошибка валидации данных пользователя'));
      }
      return next(new Error('На сервере произошла ошибка'));
    });
};

export const deleteCard = async (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  try {
    const card = await Card.findById(cardId).exec();

    if (!card) {
      return next(new NotFoundError('Карточка с указанным id не найдена'));
    }

    if (card.owner.toString() !== userId) {
      return next(new ForbiddenError('Нельзя удалить чужую карточку'));
    }

    await card.remove();
    return res.status(constants.HTTP_STATUS_NO_CONTENT).end();
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new RequestError('Не корректный id карточки'));
    }
    return next(new Error('Не корректный id карточки'));
  }
};

type TUpdateCardAction = 'like' | 'dislike';

const updateCard = (
  action: TUpdateCardAction,
) => async (req: Request & { user?: { _id: string } }, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;

    let query;
    if (action === 'like') {
      query = { $addToSet: { likes: userId } };
    } else if (action === 'dislike') {
      query = { $pull: { likes: userId } };
    }

    const card = await Card.findByIdAndUpdate(cardId, query, { new: true }).orFail();
    return res.status(constants.HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new RequestError('Ошибка валидации данных карточки'));
    }
    if (err instanceof mongoose.Error.CastError) {
      return next(new RequestError('Не корректный id карточки'));
    }
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError('Карточка с указанным id не найдена'));
    }
    return next(new Error('На сервере произошла ошибка'));
  }
};

export const likeCard = updateCard('like');
export const dislikeCard = updateCard('dislike');
