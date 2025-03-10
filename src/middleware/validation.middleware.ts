import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects, ZodError } from 'zod';
import { AppError } from './error.middleware';

const isOptionalSchemaField = (schema: AnyZodObject) => (field: string) => {
  if (schema instanceof ZodEffects) {
    return isOptionalSchemaField(schema.sourceType());
  }

  const shape = schema._def.shape();
  const element = shape[field];
  return element.isOptional();
};

const handleStrictValidationErrors = (error: ZodError) => {
  const errors = error.errors.reduce<Record<string, string[]>>((acc, err) => {
    const field = err.path.join('.');
    acc[field] = acc[field] ? [...acc[field], err.message] : [err.message];
    return acc;
  }, {});
  return new AppError('Validation failed', 400, errors);
};

const handleOptionalValidationErrors = async (
  error: ZodError,
  schema: AnyZodObject,
  req: Request,
  requestField: 'body' | 'query' | 'params'
) => {
  const isOptionalField = isOptionalSchemaField(schema);

  const originalErrors = error.errors.reduce<Record<string, string[]>>(
    (acc, err) => {
      const field = err.path.join('.');
      acc[field] = acc[field] ? [...acc[field], err.message] : [err.message];
      return acc;
    },
    {}
  );

  const fieldsWithErrors = new Set(Object.keys(originalErrors));

  const requiredErrors = Object.fromEntries(
    Object.entries(originalErrors).filter(([key]) => !isOptionalField(key))
  );

  // If there are required fields that are not present in the request, return an error
  if (Object.keys(requiredErrors).length > 0) {
    return new AppError('Validation failed', 400, requiredErrors);
  }

  // Set optional fields to undefined if they are not present in the request or invalid
  // rather than returning an error for them
  Object.keys(req[requestField]).forEach((key) => {
    if (fieldsWithErrors.has(key) && isOptionalField(key)) {
      req[requestField][key] = undefined;
    }
  });
  // Parse the data again to ensure all fields are parsed
  req[requestField] = await schema.parseAsync(req[requestField]);
};

const createValidator =
  (requestField: 'body' | 'query' | 'params') => (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsedData = await schema.parseAsync(req[requestField]);
        // Save parsed data back to request field
        req[requestField] = parsedData;
        next();
      } catch (error) {
        if (!(error instanceof ZodError)) {
          return next(error);
        }
        const maybeAppError =
          requestField === 'query'
            ? await handleOptionalValidationErrors(
                error,
                schema,
                req,
                requestField
              )
            : handleStrictValidationErrors(error);
        next(maybeAppError);
      }
    };
  };

export const validateBody = createValidator('body');
export const validateQuery = createValidator('query');
export const validateParams = createValidator('params');
