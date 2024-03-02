import { Router } from 'express';
import {
  getUsers, getUser, postUser, patchUser, patchAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', postUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchAvatar);

export default router;
