import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(`Resource not found: ${req.originalUrl}`, 404));
};
