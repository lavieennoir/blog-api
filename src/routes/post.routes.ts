import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth.middleware';
import { container } from '../config/di.config';

const router = Router();
const postController = container.resolve(PostController);

router.post('/', authenticate, postController.createPost.bind(postController));
router.put('/:id', authenticate, postController.updatePost.bind(postController));
router.delete('/:id', authenticate, postController.deletePost.bind(postController));
router.get('/', postController.getPosts.bind(postController));
router.get('/:id', postController.getPost.bind(postController));

export default router; 