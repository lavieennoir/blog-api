import { inject, injectable } from 'tsyringe';
import {
  CreatePostInput,
  GetPostsQuery,
  UpdatePostInput,
} from '../schemas/post.schema';
import { PostRepository } from '../repositories/post.repository';
import { AppError } from '../middleware/error.middleware';
import { getPaginationParams } from '../utils/pagination';

@injectable()
export class PostService {
  constructor(
    @inject(PostRepository) private readonly postRepository: PostRepository
  ) {}

  async createPost(authorId: string, input: CreatePostInput) {
    return this.postRepository.create({
      ...input,
      authorId,
    });
  }

  async updatePost(postId: string, authorId: string, input: UpdatePostInput) {
    const post = await this.postRepository.findById(postId);

    if (!post || post.authorId !== authorId) {
      throw new AppError(
        'Post not found or you do not have permission to update it',
        404
      );
    }

    return this.postRepository.update(postId, input);
  }

  async deletePost(postId: string, authorId: string) {
    const post = await this.postRepository.findById(postId);

    if (!post || post.authorId !== authorId) {
      throw new AppError(
        'Post not found or you do not have permission to delete it',
        404
      );
    }

    return this.postRepository.delete(postId);
  }

  async getPosts({ authorId, ...params }: GetPostsQuery) {
    const { page, limit, skip } = getPaginationParams(params);

    const [posts, total] = await Promise.all([
      this.postRepository.findMany({
        skip,
        take: limit,
        where: {
          authorId,
        },
      }),
      this.postRepository.count({ where: { authorId } }),
    ]);
    return {
      data: posts,
      page,
      limit,
      total,
    };
  }

  async getPostById(postId: string) {
    const post = await this.postRepository.findByIdWithAuthorAndTags(postId);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  }
}
