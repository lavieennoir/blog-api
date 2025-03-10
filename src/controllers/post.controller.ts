import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { createPostSchema, updatePostSchema } from '../schemas/post.schema';
import { PostService } from '../services/post.service';

// TODO: refactor interfaces
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

@injectable()
export class PostController {
  constructor(
    @inject(PostService) private readonly postService: PostService
  ) {}

  async createPost(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const validatedData = createPostSchema.parse(req.body);
      const post = await this.postService.createPost(req.user.id, validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async updatePost(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = req.params.id;
      const validatedData = updatePostSchema.parse(req.body);
      const post = await this.postService.updatePost(postId, req.user.id, validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async deletePost(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const postId = req.params.id;
      await this.postService.deletePost(postId, req.user.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async getPosts(req: Request, res: Response) {
    try {
      const authorId = req.query.authorId?.toString();
      const posts = await this.postService.getPosts(authorId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getPost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const post = await this.postService.getPostById(postId);
      res.json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
} 