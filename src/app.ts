import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { container } from './config/di.config';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import { LoggerService } from './services/logger.service';
import { setupErrorHandlers, startServer } from './utils/server.utils';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/users', userRoutes);
app.use('/v1/posts', postRoutes);

// Get dependencies from container
const prisma = container.resolve(PrismaClient);
const logger = container.resolve(LoggerService);

const server = startServer(app, logger);
// Setup error handlers with all required dependencies
setupErrorHandlers(server, prisma, logger);
