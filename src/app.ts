import express from 'express';
import { config } from 'dotenv';
import database from './database';
import routes from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

// Загружаем конфигурацию
config();

// Подключаемся к БД
database.connect();

// Инициализируем Express
const app = express();

// Настройки Express
app.use(express.json());

// Логер запросов
app.use(requestLogger);

// Роутер
app.use(routes);

// Логер ошибок
app.use(errorLogger);

// Запускаем сервер
app.listen(PORT, () => {});
