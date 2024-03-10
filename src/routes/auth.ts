import { Router } from 'express';
import {
  validateSignIn, validateSignUp,
} from '../middlewares/validators/auth';
import {
  login, createUser,
} from '../controllers/auth';

const router = Router();

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUser);

export default router;
