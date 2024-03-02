import { Router } from 'express';
import temporaryAuthMiddleware from '../middlewares/temporaryAuthMiddleware';
import usersRouter from './users';
import cardsRouter from './cards';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import NotFoundError from '../errors/NotFoundError';

const router = Router();

// Временный мидлвар авторизации
router.use(temporaryAuthMiddleware);

// API
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', () => {
  throw new NotFoundError('Ничего не найдено');
});

// Централизованная обработка ошибок
router.use(globalErrorHandler);

export default router;
