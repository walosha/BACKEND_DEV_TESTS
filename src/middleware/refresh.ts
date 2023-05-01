import jwt, { JwtPayload } from 'jsonwebtoken';
import redisService from '../utils/redis';
import { AppError } from '../utils/appError';
import { NextFunction, Request, Response } from 'express';

export const refreshMiddleware: any = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body?.refresh) {
    const token = req.body.refresh;

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_KEY_REFRESH as string) as JwtPayload;

      if (
        decoded.type !== process.env.JWT_REFRESH ||
        decoded.aud !== process.env.JWT_AUDIENCE ||
        decoded.iss !== process.env.JWT_ISSUER
      ) {
        next(new AppError('Invalid token type', 401));
      }

      const value = await redisService.get(token);
      if (value) {
        next(new AppError('Refresh token was already used', 401));
      }

      req.user = {
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        token,
      };
      next();
      return;
    } catch (err) {
      console.log({ err });
      next(new AppError('Invalid token', 401));
    }
  }
  next(new AppError('Refresh token is not present', 400));
};
