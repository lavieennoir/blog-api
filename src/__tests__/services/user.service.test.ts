import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { container } from '../../config/di.config';
import { UserService } from '../../services/user.service';
import { CreateUserInput, LoginUserInput } from '../../schemas/user.schema';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));
jest.mock('bcryptjs');

describe('UserService', () => {
  let userService: UserService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    // Create mock implementations
    mockPrisma = mockDeep<PrismaClient>();

    // Reset container and register mocks
    container.clearInstances();
    container.registerInstance(PrismaClient, mockPrisma);

    // Resolve service with mocked dependencies
    userService = container.resolve(UserService);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const input: CreateUserInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const mockUser = {
        id: '00000000-0000-0000-0000-000000000000',
        ...input,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(input);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          ...input,
          password: hashedPassword,
        },
      });
    });

    it('should handle user creation error', async () => {
      const input: CreateUserInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const error = new Error('Database error');
      mockPrisma.user.create.mockRejectedValue(error);

      await expect(userService.createUser(input)).rejects.toThrow(
        error.message
      );
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const input: LoginUserInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '00000000-0000-0000-0000-000000000000',
        email: input.email,
        name: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.login(input);

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw error with invalid credentials', async () => {
      const input: LoginUserInput = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(userService.login(input)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error with incorrect password', async () => {
      const input: LoginUserInput = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: '00000000-0000-0000-0000-000000000000',
        email: input.email,
        name: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.login(input)).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    container.clearInstances();
  });
});
