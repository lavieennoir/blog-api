import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>; 