import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  _id: string;
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: (v: string) => validator.isURL(v),
  },
});

export default mongoose.model<IUser>('user', userSchema);
