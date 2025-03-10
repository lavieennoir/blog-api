import { Post, PrismaClient, Prisma } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { BaseRepository } from './base.repository';
import {
  CreatePostInput,
  PostResponse,
  UpdatePostInput,
} from '../schemas/post.schema';

@injectable()
export class PostRepository extends BaseRepository {
  public readonly defaultInclude = {
    author: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    tags: {
      select: {
        id: true,
        name: true,
      },
    },
  } as const;

  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: CreatePostInput & Pick<Post, 'authorId'>): Promise<Post> {
    const { tags = [], authorId, ...postData } = data;

    return this.getPrisma().post.create({
      data: {
        ...postData,
        author: {
          connect: { id: authorId },
        },
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: this.defaultInclude,
    });
  }

  async update(id: string, data: UpdatePostInput): Promise<Post> {
    const { tags, ...postData } = data;

    return this.getPrisma().post.update({
      where: { id },
      data: {
        ...postData,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: this.defaultInclude,
    });
  }

  async delete(id: string): Promise<Post> {
    return this.getPrisma().post.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<Post | null> {
    return this.getPrisma().post.findUnique({
      where: { id },
    });
  }

  async findMany(
    findArgs: Omit<Prisma.PostFindManyArgs, 'include' | 'orderBy'>
  ): Promise<Post[]> {
    return this.getPrisma().post.findMany({
      ...findArgs,
      include: this.defaultInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count(params: { where: Prisma.PostWhereInput }): Promise<number> {
    return this.getPrisma().post.count(params);
  }

  async findByIdWithAuthorAndTags(id: string): Promise<PostResponse | null> {
    return this.getPrisma().post.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }
}
