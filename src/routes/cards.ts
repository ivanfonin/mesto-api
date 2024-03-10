import { Router } from 'express';
import {
  validatePostCard, validateCardId,
} from '../middlewares/validators/cards';
import {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', validatePostCard, postCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

export default router;
