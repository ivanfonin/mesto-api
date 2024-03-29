import mongoose, { Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import AuthError from '../errors/AuthError';

export interface IUser {
  _id?: string;
  name?: string;
  about?: string;
  avatar?: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: (v: string) => validator.isURL(v),
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (v: string) => validator.isEmail(v),
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Интерфейс модели, добавляем метод findUserByCredentials
interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line
  findUserByCredentials(email: string, password: string): Promise<IUser>;
}

async function findUserByCredentials(this: Model<IUser>, email: string, password: string):
Promise<IUser> {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new AuthError('Неправильные почта или пароль');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AuthError('Неправильные почта или пароль');
  }

  return user;
}
userSchema.statics.findUserByCredentials = findUserByCredentials;

export default mongoose.model<IUser, IUserModel>('user', userSchema);
