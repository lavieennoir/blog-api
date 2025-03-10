import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { container } from '../config/di.config';

const router = Router();
const userController = container.resolve(UserController);

router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

export default router; 