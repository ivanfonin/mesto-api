import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import Card from '../models/card';
import NotFoundError from '../errors/NotFoundError';
import RequestError from '../errors/RequestError';

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
  }).then((card) => {
    if (!card) {
      throw new RequestError('Не удалось создать карточку');
    }
    res.status(constants.HTTP_STATUS_CREATED).send(card);
  })
    .catch(next);
};

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  try {
    await Card
      .findByIdAndRemove(cardId)
      .orFail(() => new NotFoundError('Карточка с таким id не найдена'));
    return res.status(constants.HTTP_STATUS_NO_CONTENT).end();
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: err.message });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Не корректный id карточки' });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const likeCard = async (req: Request & { user?: { _id: string } }, res: Response) => {
  const { cardId } = req.params;

  try {
    const card = await Card
      .findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: req.user?._id } },
        { new: true },
      )
      .orFail(() => new RequestError('Не удалось поставить лайк'));
    return res.status(constants.HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err instanceof RequestError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: err.message });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Не корректный id карточки' });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const dislikeCard = async (req: Request & { user?: { _id: string } }, res: Response) => {
  const { cardId } = req.params;

  try {
    const card = await Card
      .findByIdAndUpdate(
        cardId,
        { $pull: { likes: req.user?._id } },
        { new: true },
      )
      .orFail(() => new RequestError('Не удалось удалить лайк'));
    return res.status(constants.HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err instanceof RequestError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: err.message });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Не корректный id карточки' });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};
