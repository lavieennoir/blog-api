import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserController {
  constructor(@inject(UserService) private readonly userService: UserService) {}

  signUp = async (req: Request, res: Response) => {
    await this.userService.createUser(req.body);
    const result = await this.userService.login({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(201).json(result);
  };

  signIn = async (req: Request, res: Response) => {
    const result = await this.userService.login(req.body);
    res.json(result);
  };
}
