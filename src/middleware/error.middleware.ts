import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../services/logger.service';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const createErrorHandler =
  (logger: LoggerService) =>
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        message: err.message,
        ...(err.details && { errors: err.details }),
      });
    }

    // Make sure JSON body is valid so it can be parsed
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
      return res.status(400).json({
        message: 'Invalid JSON',
      });
    }

    logger.error(err.message, { error: err });
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  };
