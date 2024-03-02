import express from 'express';
import { config } from 'dotenv';
import database from './database';
import routes from './routes';

const { PORT = 3000 } = process.env;

// Загружаем конфигурацию
config();

// Подключаемся к БД
database.connect();

// Инициализируем Express
const app = express();

// Настройки Express
app.use(express.json());

// Роутер
app.use(routes);

// Запускаем сервер
app.listen(PORT, () => {});
