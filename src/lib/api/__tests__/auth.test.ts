/**
 * Authentication API Unit Tests
 * Requirements: 1.1, 1.2, 1.4
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi, SignUpRequest, SignInRequest } from '../auth';
import { ApiErrorCode } from '../../types/api';

describe('Authentication API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a new user', async () => {
      // Arrange
      const signUpData: SignUpRequest = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const mockBackendResponse = {
        status: 201,
        data: {
          result: {
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
            created_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await authApi.signUp(signUpData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.data).toEqual({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        createdAt: '2024-01-01T00:00:00Z',
      });

      // Verify the request was made with snake_case fields
      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).toEqual({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      });
    });

    it('should handle sign up validation errors', async () => {
      // Arrange
      const signUpData: SignUpRequest = {
        email: 'invalid-email',
        password: '123',
        username: '',
      };

      const mockErrorResponse = {
        status: 400,
        error: {
          code: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
          details: {
            email: '이메일 형식이 올바르지 않습니다',
            password: '비밀번호는 최소 8자 이상이어야 합니다',
            username: '사용자 이름은 필수 항목입니다',
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await authApi.signUp(signUpData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.VALIDATION_ERROR);
        expect(error.message).toBe('입력값이 올바르지 않습니다');
        expect(error.statusCode).toBe(400);
        expect(error.details).toBeDefined();
      }
    });

    it('should handle duplicate email error', async () => {
      // Arrange
      const signUpData: SignUpRequest = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const mockErrorResponse = {
        status: 409,
        error: {
          code: 'CONFLICT',
          message: '이미 존재하는 이메일입니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await authApi.signUp(signUpData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('이미 존재하는 이메일입니다');
        expect(error.statusCode).toBe(409);
      }
    });
  });

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      // Arrange
      const signInData: SignInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockBackendResponse = {
        status: 200,
        data: {
          result: {
            user: {
              id: 1,
              email: 'test@example.com',
              username: 'testuser',
            },
            session_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            expires_at: '2024-01-02T00:00:00Z',
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await authApi.signIn(signInData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.user).toEqual({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      });
      expect(response.data.sessionToken).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
      expect(response.data.expiresAt).toBe('2024-01-02T00:00:00Z');

      // Verify the request was made with correct data
      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle sign in failure with invalid credentials (401)', async () => {
      // Arrange
      const signInData: SignInRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockErrorResponse = {
        status: 401,
        error: {
          code: 'UNAUTHORIZED',
          message: '이메일 또는 비밀번호가 올바르지 않습니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await authApi.signIn(signInData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
        expect(error.message).toBe('이메일 또는 비밀번호가 올바르지 않습니다');
        expect(error.statusCode).toBe(401);
      }
    });

    it('should handle sign in with non-existent user', async () => {
      // Arrange
      const signInData: SignInRequest = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const mockErrorResponse = {
        status: 401,
        error: {
          code: 'UNAUTHORIZED',
          message: '이메일 또는 비밀번호가 올바르지 않습니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await authApi.signIn(signInData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
        expect(error.statusCode).toBe(401);
      }
    });

    it('should handle network errors during sign in', async () => {
      // Arrange
      const signInData: SignInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      // Act & Assert
      try {
        await authApi.signIn(signInData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.NETWORK_ERROR);
      }
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      // Arrange
      const mockBackendResponse = {
        status: 200,
        data: {
          result: null,
          response: '로그아웃되었습니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await authApi.signOut();

      // Assert
      expect(response.status).toBe(200);
      expect(response.message).toBe('로그아웃되었습니다');

      // Verify the request was made to the correct endpoint
      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain('/api/users/sign-out');
      expect(fetchCall[1].method).toBe('POST');
    });

    it('should handle sign out when not authenticated', async () => {
      // Arrange
      const mockErrorResponse = {
        status: 401,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await authApi.signOut();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
        expect(error.statusCode).toBe(401);
      }
    });

    it('should handle server errors during sign out', async () => {
      // Arrange
      const mockErrorResponse = {
        status: 500,
        error: {
          message: '서버 오류가 발생했습니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await authApi.signOut();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.SERVER_ERROR);
        expect(error.statusCode).toBe(500);
      }
    });
  });

  describe('deleteAccount', () => {
    it('should successfully delete account', async () => {
      // Arrange
      const mockBackendResponse = {
        status: 200,
        data: {
          result: {
            deleted_graves_count: 5,
          },
          response: '계정이 삭제되었습니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await authApi.deleteAccount();

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.deletedGravesCount).toBe(5);
      expect(response.message).toBe('계정이 삭제되었습니다');

      // Verify the request was made to the correct endpoint
      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain('/api/users');
      expect(fetchCall[1].method).toBe('DELETE');
    });

    it('should handle delete account when not authenticated', async () => {
      // Arrange
      const mockErrorResponse = {
        status: 401,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await authApi.deleteAccount();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
        expect(error.statusCode).toBe(401);
      }
    });

    it('should handle account with no graves', async () => {
      // Arrange
      const mockBackendResponse = {
        status: 200,
        data: {
          result: {
            deleted_graves_count: 0,
          },
          response: '계정이 삭제되었습니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await authApi.deleteAccount();

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.deletedGravesCount).toBe(0);
    });
  });

  describe('data transformation', () => {
    it('should convert camelCase request to snake_case for backend', async () => {
      // Arrange
      const signUpData: SignUpRequest = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({
          status: 201,
          data: {
            result: {
              id: 1,
              email: 'test@example.com',
              username: 'testuser',
            },
          },
        }),
      });

      // Act
      await authApi.signUp(signUpData);

      // Assert - verify request body uses snake_case (though in this case fields are the same)
      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).toHaveProperty('email');
      expect(requestBody).toHaveProperty('password');
      expect(requestBody).toHaveProperty('username');
    });

    it('should convert snake_case response to camelCase for frontend', async () => {
      // Arrange
      const mockBackendResponse = {
        status: 200,
        data: {
          result: {
            user: {
              id: 1,
              email: 'test@example.com',
              username: 'testuser',
              created_at: '2024-01-01T00:00:00Z',
            },
            session_token: 'token123',
            expires_at: '2024-01-02T00:00:00Z',
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await authApi.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      // Assert - verify response uses camelCase
      expect(response.data).toHaveProperty('sessionToken');
      expect(response.data).toHaveProperty('expiresAt');
      expect(response.data).not.toHaveProperty('session_token');
      expect(response.data).not.toHaveProperty('expires_at');
    });
  });
});
