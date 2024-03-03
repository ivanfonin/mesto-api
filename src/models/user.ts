import mongoose from 'mongoose';
import isValidURL from '../utils/helpers';

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
    validate: (v: string) => isValidURL(v),
  },
});

export default mongoose.model<IUser>('user', userSchema);
