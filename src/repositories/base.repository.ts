import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository {
  constructor(protected readonly prisma: PrismaClient) {}

  getPrisma(): PrismaClient {
    return this.prisma;
  }
}
