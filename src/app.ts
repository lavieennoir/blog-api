import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { container } from './config/di.config';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import { LoggerService } from './services/logger.service';
import { setupErrorHandlers, startServer } from './utils/server.utils';
import swaggerRouter from './docs/swagger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use(userRoutes.basePath, userRoutes.router);
app.use(postRoutes.basePath, postRoutes.router);

// API Documentation
// should be added after all routes to register them properly
app.use(swaggerRouter.basePath, swaggerRouter.generateRouter());

// Get dependencies from container
const prisma = container.resolve(PrismaClient);
const logger = container.resolve(LoggerService);

const server = startServer(app, logger);
// Setup error handlers with all required dependencies
setupErrorHandlers(server, prisma, logger);
