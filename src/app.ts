import express from 'express';
import { config } from 'dotenv';
import database from './database';
import temporaryAuthMiddleware from './middlewares/temporaryAuthMiddleware';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000 } = process.env;

// Загружаем конфигурацию
config();

// Подключаемся к БД
database.connect();

// Инициализируем Express
const app = express();

// Настройки Express
app.use(express.json());

// Временный мидлвар авторизации
app.use(temporaryAuthMiddleware);

// API
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Запускаем сервер
app.listen(PORT, () => {});
