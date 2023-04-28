import { sign } from 'jsonwebtoken';
import { IUser } from '../types';
import { Request, Response } from 'express';
import User from '../model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';

const signToken = (id: string) => {
  return sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user: IUser, statusCode: number, req: Request, res: Response) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + (+!process.env.JWT_COOKIE_EXPIRES_IN || 0) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...otherUserData } = user;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: otherUserData,
    },
  });
};

export const signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  createSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user: any = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

export function logout(req: Request, res: Response) {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
}
