import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export const createOpenApiDocument = (registry: OpenAPIRegistry) => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: process.env.API_TITLE,
      version: process.env.API_VERSION,
      description: 'API documentation for the Blog management system',
    },
    servers: [
      {
        url: process.env.BASE_URL,
      },
    ],
  });
};
