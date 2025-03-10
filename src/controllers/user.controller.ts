import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserController {
  constructor(
    @inject(UserService) private readonly userService: UserService
  ) {}

  async register(req: Request, res: Response) {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      const result = await this.userService.login(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
} 