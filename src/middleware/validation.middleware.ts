import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './error.middleware';

const createValidator =
  (requestField: 'body' | 'query' | 'params') => (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync(req[requestField]);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.errors.reduce<Record<string, string[]>>(
            (acc, err) => {
              const field = err.path.join('.');
              acc[field] = acc[field]
                ? [...acc[field], err.message]
                : [err.message];
              return acc;
            },
            {}
          );
          console.log(errors);
          next(new AppError('Validation failed', 400, errors));
        } else {
          next(error);
        }
      }
    };
  };

export const validateBody = createValidator('body');
export const validateQuery = createValidator('query');
export const validateParams = createValidator('params');
