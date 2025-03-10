import { z } from 'zod';
import { openApiRegistry } from '../docs/openapi.registry';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const paginationInfoSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
export type PaginationInfo = z.infer<typeof paginationInfoSchema>;

openApiRegistry.register('PaginationParams', paginationSchema);
