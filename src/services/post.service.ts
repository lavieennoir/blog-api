import { inject, injectable } from 'tsyringe';
import { CreatePostInput, UpdatePostInput } from '../schemas/post.schema';
import { PostRepository } from '../repositories/post.repository';

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
      throw new Error('Post not found or unauthorized');
    }

    return this.postRepository.update(postId, input);
  }

  async deletePost(postId: string, authorId: string) {
    const post = await this.postRepository.findById(postId);

    if (!post || post.authorId !== authorId) {
      throw new Error('Post not found or unauthorized');
    }

    return this.postRepository.delete(postId);
  }

  async getPosts(authorId?: string) {
    return this.postRepository.findMany({ authorId });
  }

  async getPostById(postId: string) {
    const post = await this.postRepository.findByIdWithAuthorAndTags(postId);

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }
} 