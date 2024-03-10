import express from 'express';
import { config } from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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

// Настройки безопасности
app.use(helmet());

// Ограничиваем кол-во запросов
const limiter = rateLimit({
  windowMs: 1000 * 60 * 15, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
});
app.use(limiter);

// Логер запросов
app.use(requestLogger);

// Роутер
app.use(routes);

// Логер ошибок
app.use(errorLogger);

// Запускаем сервер
app.listen(PORT, () => {});
