import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateQuery } from '../../middleware/validation.middleware';

describe('Validation Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('validateQuery', () => {
    const testSchema = z.object({
      page: z.coerce.number().min(1).optional(),
      limit: z.coerce.number().min(1).max(100).optional(),
      authorId: z.string().uuid().optional().nullable(),
    });

    it('should convert empty strings to undefined', async () => {
      mockReq.query = {
        page: '',
        limit: '10',
        authorId: '',
      };

      await validateQuery(testSchema)(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockReq.query).toEqual({
        page: undefined,
        limit: 10,
        authorId: undefined,
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should convert invalid values to undefined', async () => {
      mockReq.query = {
        page: 'invalid',
        limit: 'abc',
        authorId: 'not-a-uuid',
      };

      await validateQuery(testSchema)(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockReq.query).toEqual({
        page: undefined,
        limit: undefined,
        authorId: undefined,
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle valid values correctly', async () => {
      mockReq.query = {
        page: '1',
        limit: '10',
        authorId: '123e4567-e89b-12d3-a456-426614174000',
      };

      await validateQuery(testSchema)(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockReq.query).toEqual({
        page: 1,
        limit: 10,
        authorId: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle missing optional fields', async () => {
      mockReq.query = {
        page: '1',
        limit: '10',
      };

      await validateQuery(testSchema)(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockReq.query).toEqual({
        page: 1,
        limit: 10,
        authorId: undefined,
      });
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
