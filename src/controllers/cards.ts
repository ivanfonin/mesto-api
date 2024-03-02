import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
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
    res.send(card);
  })
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then(() => res.send({ message: 'Успешно' }))
    .catch(next);
};

export const likeCard = (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new RequestError('Не удалось поставить лайк');
    }
    res.send(card);
  })
    .catch(next);
};

export const dislikeCard = (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new RequestError('Не удалось убрать лайк');
    }
    res.send(card);
  })
    .catch(next);
};
