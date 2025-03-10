import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private readonly userRepository: UserRepository
  ) {}

  async createUser(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    
    const user = await this.userRepository.create({
      ...input,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(input: LoginUserInput) {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
} 