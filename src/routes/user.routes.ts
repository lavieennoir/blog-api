import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { container } from '../config/di.config';
import { openApiRegistry } from '../docs/openapi.registry';
import {
  createUserSchema,
  loginResponseSchema,
  loginUserSchema,
  userSchema,
} from '../schemas/user.schema';
import { commonOpenApiNodes } from '../docs/openapi.common';

export const router = Router();
const userController = container.resolve(UserController);

// Register routes
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// Describe API for registered routes
export const basePath = '/v1/users';

openApiRegistry.registerPath({
  method: 'post',
  path: `${basePath}/register`,
  description: 'Register a new user',
  request: commonOpenApiNodes.requestWithJsonBody(createUserSchema),
  responses: {
    201: commonOpenApiNodes.jsonResponse(
      userSchema,
      'User registered successfully'
    ),
    400: commonOpenApiNodes.badRequestResponse,
  },
});

openApiRegistry.registerPath({
  method: 'post',
  path: `${basePath}/login`,
  description: 'Login a user',
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
