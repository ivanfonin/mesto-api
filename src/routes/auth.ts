import { Router } from 'express';
import {
  login, createUser,
} from '../controllers/auth';

const router = Router();

router.post('/signin', login);
router.post('/signup', createUser);

export default router;
