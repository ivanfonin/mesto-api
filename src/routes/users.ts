import { Router } from 'express';
import {
  getUsers, getUser, getAuthUser, patchUser, patchAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getAuthUser);
router.get('/:id', getUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchAvatar);

export default router;
