import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * propagate exceptions to the global error middleware
 */
export const handleExceptions = <TRequest extends Request | AuthRequest>(
  action: (req: TRequest, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: TRequest, res: Response, next: NextFunction) => {
    try {
      await action(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
