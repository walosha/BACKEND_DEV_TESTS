import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { UserPayload } from '../../@types/express';

export function restrictTo(...roles: string[]) {
  return (req: Request & { user?: UserPayload }, res: Response, next: NextFunction) => {
    // roles ['admin', 'user']. role='user'

    if (req?.user) {
      if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403));
      }
    }
    next();
  };
}
