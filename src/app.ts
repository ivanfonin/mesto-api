import express from 'express';
import { config } from 'dotenv';
import temporaryAuthMiddleware from './middlewares/temporaryAuthMiddleware';
import usersRouter from './routes/users';
import db from './database/database';

// Загружаем конфигурацию
config();

// Подключаемся к БД
db.connect();

// Инициализируем Express
const { PORT = 3000 } = process.env;
const app = express();

// Настройки Express
app.use(express.json());

// Временный мидлвар авторизации
app.use(temporaryAuthMiddleware);

// API
app.use('/users', usersRouter);

// Запускаем сервер
app.listen(PORT, () => {});
