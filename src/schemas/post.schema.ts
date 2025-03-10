import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>; 