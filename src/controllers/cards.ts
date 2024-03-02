import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  Card.find({}).then((cards) => res.send(cards))
    .catch((err) => res.status(400).send(err));
};

export const postCard = (req: Request & { user?: { _id: string } }, res: Response) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user?._id,
  }).then((card) => res.send(card))
    .catch((err) => res.status(400).send(err));
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then(() => res.send({ message: 'Успешно' }))
    .catch((err) => res.status(400).send(err));
};

export const likeCard = (req: Request & { user?: { _id: string } }, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  ).then((card) => res.send(card))
    .catch((err) => res.status(400).send(err));
};

export const dislikeCard = (req: Request & { user?: { _id: string } }, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  ).then((card) => res.send(card))
    .catch((err) => res.status(400).send(err));
};
