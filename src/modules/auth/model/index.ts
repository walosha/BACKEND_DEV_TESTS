import { Document, Model, Schema, model } from 'mongoose';
import * as EmailValidator from 'email-validator';
import { hash, compare } from 'bcryptjs';
// import { IUser } from '../types';

interface UserAttrs {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

export interface UserModel extends Model<IUser> {
  build(attrs: UserAttrs): IUser;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [EmailValidator.validate, 'Please provide a valid email'],
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await hash(this.password, 12);

  // Delete passwordConfirm field
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return await compare(candidatePassword, userPassword);
};

// const User = model<IUser>('User', userSchema);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;
