import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { registerUser, loginUser, deleteUser } from '../../controllers/userController';
import {
  createUserService,
  deleteUserService,
  getById,
  getByUsername,
  loginUserService,
} from '../../services/userService';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ClientError } from '../../errors/client-error';

vi.mock('../../services/userService');

describe('UserController', async () => {
  let mockReply: FastifyReply;

  beforeEach(() => {
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;
    vi.clearAllMocks();
  });
  const mockUser = {
    username: 'testuserController',
    password: 'teste123',
    email: 'testController@example.com',
    id: 'mock-id',
    class: 'mock-class',
  };

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      (getByUsername as Mock).mockResolvedValue(null);
      (createUserService as Mock).mockResolvedValue(mockUser);

      const mockRequest = {
        body: {
          username: mockUser.username,
          email: mockUser.email,
          password: mockUser.password,
          class: mockUser.class,
        },
      } as FastifyRequest<{
        Body: {
          username: string;
          password: string;
          email: string;
          class: string;
        };
      }>;

      await registerUser(mockRequest, mockReply);

      expect(getByUsername).toHaveBeenCalledWith(mockUser.username);
      expect(createUserService).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username,
        class: mockUser.class,
      });
      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
        username: mockUser.username,
        class: mockUser.class,
      });
    });

    it('should return 500 if user already exists', async () => {
      (getByUsername as Mock).mockResolvedValue(mockUser);

      const mockRequest = {
        body: mockUser,
      } as FastifyRequest<{ Body: typeof mockUser }>;

      await registerUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully', async () => {
      (loginUserService as Mock).mockResolvedValue({
        token: 'mock-token',
        user: mockUser,
      });

      const mockRequest = {
        body: {
          email: mockUser.email,
          password: mockUser.password,
        },
      } as FastifyRequest<{ Body: { email: string; password: string } }>;

      await loginUser(mockRequest, mockReply);

      expect(loginUserService).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        token: 'mock-token',
        user: mockUser,
      });
    });

    it('should return 500 on login service failure', async () => {
      (loginUserService as Mock).mockRejectedValue(new ClientError('Login failed'));

      const mockRequest = {
        body: {
          email: mockUser.email,
          password: mockUser.password,
        },
      } as FastifyRequest<{ Body: { email: string; password: string } }>;

      await loginUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const id = 'mock-id';

      (getById as Mock).mockResolvedValue({ id });
      (deleteUserService as Mock).mockResolvedValue(undefined);
      const mockRequest = {
        params: {
          id,
        },
      } as FastifyRequest<{ Params: { id: string } }>;

      await deleteUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(204);

      expect(mockReply.send).toHaveBeenCalledWith();
    });

    it('should return 404 if user is not found', async () => {
      const id = 'mock-id';

      (getById as Mock).mockResolvedValue(null);

      const mockRequest = {
        params: {
          id,
        },
      } as FastifyRequest<{ Params: { id: string } }>;

      await deleteUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(404);

      expect(mockReply.send).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
});
