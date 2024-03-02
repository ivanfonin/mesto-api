import mongoose from 'mongoose';

const db = {
  connect: () => mongoose.connect(`${process.env.DB_SERVER}${process.env.DB_NAME}`),
};

export default db;
