import { Router } from 'express';
import { z } from 'zod';
import { PostController } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth.middleware';
import { container } from '../config/di.config';
import { openApiRegistry } from '../docs/openapi.registry';
import {
  createPostSchema,
  postSchema,
  updatePostSchema,
} from '../schemas/post.schema';
import { commonOpenApiNodes } from '../docs/openapi.common';
import { validateBody } from '../middleware/validation.middleware';
import { handleExceptions } from '../utils/controller-error.utils';

export const router = Router();
const postController = container.resolve(PostController);

// Register routes
router.get('/', handleExceptions(postController.getPosts));
router.get('/:id', handleExceptions(postController.getPost));
router.post(
  '/',
  authenticate,
  validateBody(createPostSchema),
  handleExceptions(postController.createPost)
);
router.put(
  '/:id',
  authenticate,
  validateBody(updatePostSchema),
  handleExceptions(postController.updatePost)
);
router.delete(
  '/:id',
  authenticate,
  handleExceptions(postController.deletePost)
);

// Describe API for registered routes
export const basePath = '/v1/posts';

openApiRegistry.registerPath({
  method: 'get',
  path: basePath,
  description: 'Get all posts',
  responses: {
    200: commonOpenApiNodes.jsonResponse(z.array(postSchema), 'List of posts'),
  },
});

openApiRegistry.registerPath({
  method: 'get',
  path: `${basePath}/{id}`,
  description: 'Get a post by ID',
  request: commonOpenApiNodes.requestWithIdParam,
  responses: {
    200: commonOpenApiNodes.jsonResponse(postSchema, 'Post found'),
    404: commonOpenApiNodes.notFoundResponse,
  },
});

openApiRegistry.registerPath({
  method: 'post',
  path: basePath,
  description: 'Create a new post',
  security: commonOpenApiNodes.bearerAuthSecurity,
  request: commonOpenApiNodes.requestWithJsonBody(createPostSchema),
  responses: {
    201: commonOpenApiNodes.jsonResponse(
      postSchema,
      'Post created successfully'
    ),
    400: commonOpenApiNodes.badRequestResponse,
    401: commonOpenApiNodes.unauthorizedResponse,
  },
});

openApiRegistry.registerPath({
  method: 'put',
  path: `${basePath}/{id}`,
  description: 'Update a post',
  security: commonOpenApiNodes.bearerAuthSecurity,
  request: {
    ...commonOpenApiNodes.requestWithIdParam,
    ...commonOpenApiNodes.requestWithJsonBody(updatePostSchema),
  },
  responses: {
    200: commonOpenApiNodes.jsonResponse(
      postSchema,
      'Post updated successfully'
    ),
    401: commonOpenApiNodes.unauthorizedResponse,
    404: commonOpenApiNodes.notFoundResponse,
  },
});

openApiRegistry.registerPath({
  method: 'delete',
  path: `${basePath}/{id}`,
  description: 'Delete a post',
  security: commonOpenApiNodes.bearerAuthSecurity,
  request: commonOpenApiNodes.requestWithIdParam,
  responses: {
    204: {
      description: 'Post deleted successfully',
    },
    401: commonOpenApiNodes.unauthorizedResponse,
    404: commonOpenApiNodes.notFoundResponse,
  },
});

const postRoutes = {
  router,
  basePath,
} as const;

export default postRoutes;
