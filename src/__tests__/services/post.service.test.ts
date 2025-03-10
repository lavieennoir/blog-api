import { PrismaClient } from '@prisma/client';
import { container } from '../../config/di.config';
import { PostService } from '../../services/post.service';
import { AppError } from '../../middleware/error.middleware';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

describe('PostService', () => {
  let postService: PostService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  const defaultPostsInclude = {
    author: {
      select: {
        id: true,
        email: true,
        name: true,
      },
    },
    tags: {
      select: {
        id: true,
        name: true,
      },
    },
  } as const;

  beforeEach(() => {
    // Create mock implementations
    mockPrisma = mockDeep<PrismaClient>();

    // Reset container and register mocks
    container.clearInstances();
    container.registerInstance(PrismaClient, mockPrisma);

    // Resolve service with mocked dependencies
    postService = container.resolve(PostService);
  });

  describe('getPosts', () => {
    it('should return paginated posts', async () => {
      const mockPosts = [
        { id: '1', title: 'Post 1' },
        { id: '2', title: 'Post 2' },
      ];
      const mockTotal = 2;

      (mockPrisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);
      (mockPrisma.post.count as jest.Mock).mockResolvedValue(mockTotal);

      const result = await postService.getPosts({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        data: mockPosts,
        page: 1,
        limit: 10,
        total: mockTotal,
      });
      expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: defaultPostsInclude,
        where: {
          authorId: undefined,
        },
      });
    });

    it('should handle pagination parameters correctly', async () => {
      const mockPosts = [{ id: '1', title: 'Post 1' }];
      const mockTotal = 1;

      (mockPrisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);
      (mockPrisma.post.count as jest.Mock).mockResolvedValue(mockTotal);

      const result = await postService.getPosts({
        page: 2,
        limit: 5,
      });

      expect(result).toEqual({
        data: mockPosts,
        page: 2,
        limit: 5,
        total: mockTotal,
      });
      expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: defaultPostsInclude,
        where: {
          authorId: undefined,
        },
      });
    });
  });

  describe('getPostById', () => {
    it('should return a post by id', async () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Test Content',
      };

      (mockPrisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost);

      const result = await postService.getPostById('1');

      expect(result).toEqual(mockPost);
      expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: defaultPostsInclude,
      });
    });

    it('should throw AppError when post is not found', async () => {
      (mockPrisma.post.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(postService.getPostById('1')).rejects.toThrow(AppError);
      expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: defaultPostsInclude,
      });
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const authorId = 'user-1';
      const postData = {
        title: 'New Post',
        content: 'New Content',
      };

      const mockPost = {
        id: '1',
        ...postData,
      };

      (mockPrisma.post.create as jest.Mock).mockResolvedValue(mockPost);

      const result = await postService.createPost(authorId, postData);

      expect(result).toEqual(mockPost);
      expect(mockPrisma.post.create).toHaveBeenCalledWith({
        data: {
          ...postData,
          author: {
            connect: { id: authorId },
          },
          tags: {
            connectOrCreate: [],
          },
        },
        include: defaultPostsInclude,
      });
    });
  });

  describe('updatePost', () => {
    it('should update an existing post', async () => {
      const postId = '1';
      const authorId = 'user-1';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      const mockPost = {
        id: postId,
        ...updateData,
      };

      (mockPrisma.post.findUnique as jest.Mock).mockResolvedValue({
        id: postId,
        authorId,
      });
      (mockPrisma.post.update as jest.Mock).mockResolvedValue(mockPost);

      const result = await postService.updatePost(postId, authorId, updateData);

      expect(result).toEqual(mockPost);
      expect(mockPrisma.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: updateData,
        include: defaultPostsInclude,
      });
    });

    it('should throw AppError when post is not found', async () => {
      (mockPrisma.post.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        postService.updatePost('1', 'user-1', {
          title: 'New Title',
          content: 'New Content',
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('deletePost', () => {
    it('should delete an existing post', async () => {
      const postId = '1';
      const authorId = 'user-1';

      (mockPrisma.post.findUnique as jest.Mock).mockResolvedValue({
        id: postId,
        authorId,
      });
      (mockPrisma.post.delete as jest.Mock).mockResolvedValue({ id: postId });

      await postService.deletePost(postId, authorId);

      expect(mockPrisma.post.delete).toHaveBeenCalledWith({
        where: { id: postId },
      });
    });

    it('should throw AppError when post is not found', async () => {
      (mockPrisma.post.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(postService.deletePost('1', 'user-1')).rejects.toThrow(
        AppError
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    container.clearInstances();
  });
});
