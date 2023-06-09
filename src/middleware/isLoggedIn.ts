/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../modules/auth/model';

// Only for rendered pages, no errors!
export async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded: any = await jwt.verify(req.cookies.jwt, process.env.JWT_KEY_SECRET as string);

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded?.id);
      if (!currentUser) {
        return next();
      }

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
}
