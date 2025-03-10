import { Server } from 'http';
import { PrismaClient, Prisma } from '@prisma/client';
import { LoggerService } from '../services/logger.service';
import { Express } from 'express';
const FATAL_ERROR_CODES = new Set([
  'EADDRINUSE',  // Port already in use
  'EACCES',      // Permission denied
  'ECONNREFUSED' // Database connection refused
]);

const isFatalError = (error: Error): boolean => {
  // Check for specific error codes that should trigger shutdown
  if ('code' in error && typeof error.code === 'string') {
    return FATAL_ERROR_CODES.has(error.code);
  }

  // Check for critical system errors
  return (
    error.message.includes('out of memory') ||
    // Database connection errors are fatal
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError
  );
};

const createServerShutdown = (server: Server, prisma: PrismaClient, logger: LoggerService) => {
  return async () => {
    logger.info('Received shutdown signal');

    // First, stop accepting new connections
    server.close((err) => {
      if (err) {
        logger.error('Error closing server:', { error: err });
        process.exit(1);
      }
      logger.info('Server closed successfully');
    });

    try {
      // Disconnect Prisma
      await prisma.$disconnect();
      logger.info('Database connections closed');

      // Exit process
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', { error });
      process.exit(1);
    }
  };
};

export const setupErrorHandlers = (
  server: Server, 
  prisma: PrismaClient,
  logger: LoggerService
): void => {
  const shutdown = createServerShutdown(server, prisma, logger);

  // Handle various signals
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', { 
      error,
      stack: error.stack,
      metadata: {
        type: error.name,
        code: 'code' in error ? error.code : undefined,
        isFatal: isFatalError(error)
      }
    });
    
    // Only shutdown for fatal errors
    if (isFatalError(error)) {
      logger.error('Fatal error detected, initiating shutdown');
      shutdown();
    } else {
      logger.warn('Non-fatal error detected, attempting to continue operation');
    }
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    
    logger.error('Unhandled Rejection:', { 
      error,
      promise,
      stack: error.stack,
      metadata: {
        type: error.name,
        code: 'code' in error ? error.code : undefined,
        isFatal: isFatalError(error)
      }
    });

    // Convert to uncaught exception to handle it in the same way
    throw error;
  });

  // Handle server startup errors
  server.on('error', (error: Error) => {
    logger.error('Error starting server:', { 
      error,
      stack: error.stack,
      metadata: {
        type: error.name,
        code: 'code' in error ? error.code : undefined
      }
    });
    // Server startup errors are always fatal
    process.exit(1);
  });
};

export const startServer = (app: Express, logger: LoggerService) => {
  const port = process.env.PORT || 3000;
  return app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
};

