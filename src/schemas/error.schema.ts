import { z } from 'zod';
import { openApiRegistry } from '../docs/openapi.registry';

export const errorResponseSchema = z.object({
  message: z.string(),
});

openApiRegistry.register('ErrorResponse', errorResponseSchema);

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
