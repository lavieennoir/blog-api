import { z } from 'zod';
import { errorResponseSchema } from '../schemas/error.schema';

export const commonOpenApiNodes = {
  badRequestResponse: {
    description: 'Bad request',
    content: {
      'application/json': {
        schema: errorResponseSchema,
      },
    },
  },
  unauthorizedResponse: {
    description: 'Unauthorized',
    content: {
      'application/json': {
        schema: errorResponseSchema,
      },
    },
  },
  notFoundResponse: {
    description: 'Not found',
    content: {
      'application/json': {
        schema: errorResponseSchema,
      },
    },
  },
  requestWithIdParam: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  requestWithJsonBody: (schema: z.ZodSchema) => ({
    body: {
      content: {
        'application/json': {
          schema,
        },
      },
    },
  }),
  jsonResponse: (schema: z.ZodSchema, description: string) => ({
    description,
    content: {
      'application/json': {
        schema,
      },
    },
  }),
  bearerAuthSecurity: [{ bearerAuth: [] }],
};
