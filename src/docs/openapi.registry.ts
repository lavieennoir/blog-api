import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const openApiRegistry = new OpenAPIRegistry();

// Register security scheme
openApiRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description:
    'JWT token obtained from the login endpoint (without the "Bearer" text)',
});
