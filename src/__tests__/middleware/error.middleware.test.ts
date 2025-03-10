import { Request, Response, NextFunction } from 'express';
import { createErrorHandler } from '../../middleware/error.middleware';
import { AppError } from '../../middleware/error.middleware';
import { LoggerService } from '../../services/logger.service';

describe('Error Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockLogger: Partial<LoggerService>;
  let errorHandler: ReturnType<typeof createErrorHandler>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockLogger = {
      error: jest.fn(),
    };
    errorHandler = createErrorHandler(mockLogger as LoggerService);
  });

  describe('AppError', () => {
    it('should create an AppError with default status code', () => {
      const error = new AppError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.details).toBeUndefined();
    });

    it('should create an AppError with custom status code', () => {
      const error = new AppError('Not found', 404);
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
      expect(error.details).toBeUndefined();
    });

    it('should create an AppError with details', () => {
      const details = { field: ['Invalid value'] };
      const error = new AppError('Validation failed', 400, details);
      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
    });
  });

  describe('Error Handler', () => {
    it('should handle AppError correctly', () => {
      const error = new AppError('Test error', 400, {
        field: ['Invalid value'],
      });
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Test error',
        errors: { field: ['Invalid value'] },
      });
    });

    it('should handle SyntaxError for invalid JSON', () => {
      const error = new SyntaxError('Unexpected token } in JSON at position 1');
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid JSON',
      });
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
      expect(mockLogger.error).toHaveBeenCalledWith(error.message, { error });
    });
  });
});
