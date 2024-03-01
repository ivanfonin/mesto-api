import express from 'express';
import { config } from 'dotenv';

// Загружаем конфигурацию
config();

// Инициализируем Express
const { PORT = 3000 } = process.env;
const app = express();

// Настройки Express
app.use(express.json());

// Запускаем сервер
app.listen(PORT, () => {});
