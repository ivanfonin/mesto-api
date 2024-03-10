import { Router } from 'express';
import {
  validateGetUser, validatePatchUser, validatePatchAvatar,
} from '../middlewares/validators/users';
import {
  getUsers, getUser, getAuthUser, patchUser, patchAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getAuthUser);
router.get('/:id', validateGetUser, getUser);
router.patch('/me', validatePatchUser, patchUser);
router.patch('/me/avatar', validatePatchAvatar, patchAvatar);

export default router;
