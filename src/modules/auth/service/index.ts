import { sign } from 'jsonwebtoken';
import { IUser } from '../types';
import { Request, Response } from 'express';
import User from '../model';
import { AppError } from '../../../utils/appError';
import { catchAsync } from '../../../utils/catchAsync';
import redisService from '../../../utils/redis';

const accessToken = (user: { _id: string; name: string; email: string; role: string }) => {
  return sign(
    { id: user._id, name: user.name, email: user.email, type: process.env.JWT_ACCESS, role: user.role },
    process.env.JWT_KEY_SECRET as string,
    {
      subject: user.email,
      expiresIn: process.env.JWT_EXPIRES_IN,
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER,
    },
  );
};

const refreshToken = (user: { _id: string; name: string; email: string; role: string }) => {
  return sign(
    { id: user._id, name: user.name, email: user.email, type: process.env.JWT_REFRESH, role: user.role },
    process.env.JWT_KEY_REFRESH as string,
    {
      subject: user.email,
      expiresIn: process.env.JWT_EXPIRES_IN,
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER,
    },
  );
};

const createSendToken = (user: IUser, statusCode: number, req: Request, res: Response) => {
  const acess = accessToken(user);
  const refresh = refreshToken(user);

  // Remove password from output
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, email, role, ...otherUserData } = user;

  res.status(statusCode).json({
    status: 'success',
    acess,
    refresh,
    data: {
      name,
      email,
      role,
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

export const getMe = catchAsync(async (req, res) => {
  const user = req.user;

  // 3) If everything ok, send token to client
  res.status(200).json({ message: 'user sucessfully fetched!', user });
});

export function logout(req: Request, res: Response) {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
}

export async function refresh(req: Request, res: Response) {
  const user: any = req.user;
  await redisService.set({
    key: user?.token,
    value: '1',
    timeType: 'EX',
    time: parseInt(process.env.JWT_REFRESH_TIME || '', 10),
  });
  const refresh = refreshToken(user);
  return res.status(200).json({ status: 'sucess', refresh });
}

export async function fetchUsers(req: Request, res: Response) {
  const body = req.body;
  console.log({ body });
  try {
    const users = await User.find();
    return res.status(200).json({ message: 'sucessfully fetch users', data: users });
  } catch (error: any) {
    new AppError(error.message, 201);
  }
}

export async function deleteUser(req: Request, res: Response) {
  const id = req.params.id;

  try {
    await User.deleteOne({ _id: id });
    return res.status(200).json({ message: 'sucessfully deleted users' });
  } catch (error: any) {
    new AppError(error.message, 201);
  }
}
