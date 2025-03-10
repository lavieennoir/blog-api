import { z } from 'zod';
import { openApiRegistry } from '../docs/openapi.registry';

export const createUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(2).max(255),
  password: z.string().min(6).max(255),
});

export const loginUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().max(255),
});

export const authorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
});

export const userSchema = z.object({
  ...authorSchema.shape,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

openApiRegistry.register('CreateUserInput', createUserSchema);
openApiRegistry.register('LoginUserInput', loginUserSchema);
openApiRegistry.register('Author', authorSchema);
openApiRegistry.register('User', userSchema);
openApiRegistry.register('LoginResponse', loginResponseSchema);

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
