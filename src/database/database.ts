import mongoose from 'mongoose';

const db = {
  init() {
    mongoose.connect(`${process.env.DB_SERVER}${process.env.DB_NAME}`);
  },
};

export default db;
