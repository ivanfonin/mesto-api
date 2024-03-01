import express from 'express';

// Инициализируем Express
const { PORT = 3000 } = process.env;
const app = express();

// Настройки Express
app.use(express.json());

// Запускаем сервер
app.listen(PORT, () => {});
