import mongoose from 'mongoose';

const {
  DB_SERVER = 'mongodb://localhost:27017/',
  DB_NAME = 'mestodb',
} = process.env;

const db = {
  connect: () => mongoose.connect(`${DB_SERVER}${DB_NAME}`),
};

export default db;
