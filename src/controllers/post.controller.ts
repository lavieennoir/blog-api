import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { PostService } from '../services/post.service';
import { AuthRequest } from '../middleware/auth.middleware';

@injectable()
export class PostController {
  constructor(@inject(PostService) private readonly postService: PostService) {}

  createPost = async (req: AuthRequest, res: Response) => {
    const post = await this.postService.createPost(req.user.id, req.body);
    res.status(201).json(post);
  };

  updatePost = async (req: AuthRequest, res: Response) => {
    const postId = req.params.id;
    const post = await this.postService.updatePost(
      postId,
      req.user.id,
      req.body
    );
    res.json(post);
  };

  deletePost = async (req: AuthRequest, res: Response) => {
    const postId = req.params.id;
    await this.postService.deletePost(postId, req.user.id);
    res.status(204).send();
  };

  getPosts = async (req: Request, res: Response) => {
    const authorId = req.query.authorId?.toString();
    const posts = await this.postService.getPosts(authorId);
    res.json(posts);
  };

  getPost = async (req: Request, res: Response) => {
    const postId = req.params.id;
    const post = await this.postService.getPostById(postId);
    res.json(post);
  };
}
