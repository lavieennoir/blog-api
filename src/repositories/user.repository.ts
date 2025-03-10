import { PrismaClient, User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { BaseRepository } from './base.repository';

@injectable()
export class UserRepository extends BaseRepository {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
  }): Promise<User> {
    return this.getPrisma().user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.getPrisma().user.findUnique({
      where: { email },
    });
  }
}
