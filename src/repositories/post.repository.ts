import { Post, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { BaseRepository } from './base.repository';

@injectable()
export class PostRepository extends BaseRepository {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: {
    title: string;
    content: string;
    published?: boolean;
    authorId: string;
    tags?: string[];
  }): Promise<Post> {
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
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      published?: boolean;
      tags?: string[];
    }
  ): Promise<Post> {
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
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
      },
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

  async findMany(params: { authorId?: string }): Promise<Post[]> {
    return this.getPrisma().post.findMany({
      where: params.authorId ? { authorId: params.authorId } : undefined,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByIdWithAuthorAndTags(id: string): Promise<Post & {
    author: { id: string; name: string; email: string };
    tags: { id: string; name: string }[];
  } | null> {
    return this.getPrisma().post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
      },
    });
  }
} 