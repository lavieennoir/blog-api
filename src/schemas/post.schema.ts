import { z } from 'zod';
import { openApiRegistry } from '../docs/openapi.registry';
import { authorSchema } from './user.schema';

export const createTagByNameSchema = z.string().min(1).max(255);

const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
});

export const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(5000),
  published: z.boolean().optional(),
  tags: z.array(createTagByNameSchema).optional(),
});

export const updatePostSchema = z.object({
  ...createPostSchema.shape,
});

export const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(5000),
  published: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.string().uuid(),
  author: authorSchema,
  tags: z.array(tagSchema),
});

openApiRegistry.register('CreatePostInput', createPostSchema);
openApiRegistry.register('UpdatePostInput', updatePostSchema);
openApiRegistry.register('Post', postSchema);
openApiRegistry.register('Tag', tagSchema);

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
