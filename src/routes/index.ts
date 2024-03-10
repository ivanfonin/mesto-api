import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import authRouter from './auth';
import usersRouter from './users';
import cardsRouter from './cards';
import { requestLogger, errorLogger } from '../middlewares/logger';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import NotFoundError from '../errors/NotFoundError';

const router = Router();

// Логер запросов
router.use(requestLogger);

// API
router.use('/', authRouter);
router.use(authMiddleware);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', () => {
  throw new NotFoundError('Ничего не найдено');
});

// Логер ошибок
router.use(errorLogger);

// Централизованная обработка ошибок
router.use(globalErrorHandler);

export default router;
