import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { createOpenApiDocument } from './openapi.document';
import { openApiRegistry } from './openapi.registry';

const generateSwaggerRouter = () => {
  const router = Router();

  if (process.env.ENABLE_DOCS === 'true') {
    router.use('/', swaggerUi.serve);
    router.get('/', swaggerUi.setup(createOpenApiDocument(openApiRegistry)));
  }

  return router;
};

const swaggerRouter = {
  generateRouter: generateSwaggerRouter,
  basePath: '/v1/docs',
} as const;

export default swaggerRouter;
