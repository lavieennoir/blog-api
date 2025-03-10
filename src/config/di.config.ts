import "reflect-metadata";
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { PostRepository } from "../repositories/post.repository";
import { UserRepository } from "../repositories/user.repository";
import { PostService } from "../services/post.service";
import { UserService } from "../services/user.service";
import { LoggerService } from "../services/logger.service";

// Register Logger (should be first as other services might need it during initialization)
container.registerSingleton(LoggerService);

// Register Prisma
container.registerInstance(PrismaClient, new PrismaClient());

// Register Repositories
container.registerSingleton(PostRepository);
container.registerSingleton(UserRepository);

// Register Services
container.registerSingleton(PostService);
container.registerSingleton(UserService);

export { container }; 