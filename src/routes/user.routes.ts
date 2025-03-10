import { Router } from 'express';
import { container } from '../config/di.config';
import { UserController } from '../controllers/user.controller';
import {
  createUserSchema,
  loginResponseSchema,
  loginUserSchema,
} from '../schemas/user.schema';
import { validateBody } from '../middleware/validation.middleware';
import { openApiRegistry } from '../docs/openapi.registry';
import { commonOpenApiNodes } from '../docs/openapi.common';
import { handleExceptions } from '../utils/controller-error.utils';

export const router = Router();
const userController = container.resolve(UserController);

// Register routes
router.post(
  '/signup',
  validateBody(createUserSchema),
  handleExceptions(userController.signUp)
);
router.post(
  '/signin',
  validateBody(loginUserSchema),
  handleExceptions(userController.signIn)
);

// Describe API for registered routes
export const basePath = '/v1/users';

openApiRegistry.registerPath({
  method: 'post',
  path: `${basePath}/signup`,
  description: 'Register a new user and get access token',
  request: commonOpenApiNodes.requestWithJsonBody(createUserSchema),
  responses: {
    201: commonOpenApiNodes.jsonResponse(
      loginResponseSchema,
      'User registered successfully'
    ),
    400: commonOpenApiNodes.badRequestResponse,
  },
});

openApiRegistry.registerPath({
  method: 'post',
  path: `${basePath}/signin`,
  description: 'Get user access token',
  request: commonOpenApiNodes.requestWithJsonBody(loginUserSchema),
  responses: {
    200: commonOpenApiNodes.jsonResponse(
      loginResponseSchema,
      'User logged in successfully'
    ),
    400: commonOpenApiNodes.badRequestResponse,
  },
});

const userRoutes = {
  router,
  basePath,
} as const;

export default userRoutes;
