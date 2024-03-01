import express from 'express';
import { config } from 'dotenv';
import db from './database/database';

// Загружаем конфигурацию
config();

// Подключаемся к БД
db.init();

// Инициализируем Express
const { PORT = 3000 } = process.env;
const app = express();

// Настройки Express
app.use(express.json());

// Запускаем сервер
app.listen(PORT, () => {});
