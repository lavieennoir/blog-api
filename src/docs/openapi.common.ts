import { z } from 'zod';
import { errorResponseSchema } from '../schemas/error.schema';
import { paginationInfoSchema } from '../schemas/pagination.schema';

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
  requestWithJsonBody: <T extends z.ZodSchema>(schema: T) => ({
    body: {
      content: {
        'application/json': {
          schema,
        },
      },
    },
  }),
  requestWithQueryParams: <T extends z.ZodSchema>(schema: T) => ({
    query: schema,
  }),
  jsonResponse: <T extends z.ZodSchema>(schema: T, description: string) => ({
    description,
    content: {
      'application/json': {
        schema,
      },
    },
  }),
  paginatedJsonResponse: <T extends z.ZodSchema>(
    entitySchema: T,
    description: string
  ) => ({
    description,
    content: {
      'application/json': {
        schema: z.object({
          data: z.array(entitySchema),
          ...paginationInfoSchema.shape,
        }),
      },
    },
  }),
  bearerAuthSecurity: [{ bearerAuth: [] }],
};
