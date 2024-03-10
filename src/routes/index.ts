import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import authRouter from './auth';
import usersRouter from './users';
import cardsRouter from './cards';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import NotFoundError from '../errors/NotFoundError';

const router = Router();

// API
router.use('/', authRouter);
router.use(authMiddleware);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', () => {
  throw new NotFoundError('Ничего не найдено');
});

// Централизованная обработка ошибок
router.use(globalErrorHandler);

export default router;
