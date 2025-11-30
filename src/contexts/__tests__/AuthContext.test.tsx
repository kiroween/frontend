/**
 * Auth Context Tests
 * 
 * Tests for authentication context functionality
 * Requirements: 1.3, 1.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authApi } from '@/lib/api/auth';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { apiClient } from '@/lib/api/client';
import fc from 'fast-check';

// Mock dependencies
vi.mock('@/lib/api/auth');
vi.mock('@/lib/auth/tokenStorage');
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    setAuthToken: vi.fn(),
    removeAuthToken: vi.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with no user and not authenticated', () => {
    vi.mocked(tokenStorage.getToken).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should sign in successfully and store token', async () => {
    const mockAuthResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      },
      sessionToken: 'mock-token-123',
      expiresAt: '2025-12-31T23:59:59Z',
    };

    vi.mocked(authApi.signIn).mockResolvedValue({
      data: mockAuthResponse,
      status: 200,
    });

    vi.mocked(tokenStorage.getToken).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // Verify token was stored
    expect(tokenStorage.setToken).toHaveBeenCalledWith(
      'mock-token-123',
      '2025-12-31T23:59:59Z'
    );

    // Verify token was set in API client
    expect(apiClient.setAuthToken).toHaveBeenCalledWith('mock-token-123');

    // Verify user state was updated
    expect(result.current.user).toEqual(mockAuthResponse.user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should sign out and remove token', async () => {
    const mockAuthResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      },
      sessionToken: 'mock-token-123',
      expiresAt: '2025-12-31T23:59:59Z',
    };

    vi.mocked(authApi.signIn).mockResolvedValue({
      data: mockAuthResponse,
      status: 200,
    });

    vi.mocked(authApi.signOut).mockResolvedValue({
      data: undefined,
      status: 200,
    });

    vi.mocked(tokenStorage.getToken).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // First sign in
    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then sign out
    await act(async () => {
      await result.current.signOut();
    });

    // Verify token was removed
    expect(tokenStorage.removeToken).toHaveBeenCalled();

    // Verify token was removed from API client
    expect(apiClient.removeAuthToken).toHaveBeenCalled();

    // Verify user state was cleared
    expect(result.current.user).toBeNull();
  });

  it('should sign up successfully', async () => {
    const mockUser = {
      id: 1,
      email: 'newuser@example.com',
      username: 'newuser',
    };

    vi.mocked(authApi.signUp).mockResolvedValue({
      data: mockUser,
      status: 201,
    });

    vi.mocked(tokenStorage.getToken).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signUp({
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
      });
    });

    // Sign up doesn't set user state (user needs to sign in)
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should delete account and remove token', async () => {
    const mockAuthResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      },
      sessionToken: 'mock-token-123',
      expiresAt: '2025-12-31T23:59:59Z',
    };

    vi.mocked(authApi.signIn).mockResolvedValue({
      data: mockAuthResponse,
      status: 200,
    });

    vi.mocked(authApi.deleteAccount).mockResolvedValue({
      data: { deletedGravesCount: 5 },
      status: 200,
    });

    vi.mocked(tokenStorage.getToken).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // First sign in
    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then delete account
    await act(async () => {
      await result.current.deleteAccount();
    });

    // Verify token was removed
    expect(tokenStorage.removeToken).toHaveBeenCalled();

    // Verify token was removed from API client
    expect(apiClient.removeAuthToken).toHaveBeenCalled();

    // Verify user state was cleared
    expect(result.current.user).toBeNull();
  });

  it('should handle sign in error', async () => {
    vi.mocked(authApi.signIn).mockRejectedValue(new Error('Invalid credentials'));
    vi.mocked(tokenStorage.getToken).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await expect(
      act(async () => {
        await result.current.signIn({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      })
    ).rejects.toThrow('Invalid credentials');

    // Verify user state was not updated
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should restore authentication state from stored token on mount', async () => {
    vi.mocked(tokenStorage.getToken).mockReturnValue('existing-token-123');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify token was set in API client
    expect(apiClient.setAuthToken).toHaveBeenCalledWith('existing-token-123');

    // Verify authenticated state
    expect(result.current.isAuthenticated).toBe(true);
  });

  /**
   * Property-Based Test: Token persistence and inclusion
   * Feature: backend-api-integration, Property 1: Token persistence and inclusion
   * 
   * For any successful login response containing a session token, storing the token
   * should result in all subsequent API requests including that token in the Authorization header.
   * 
   * Validates: Requirements 1.3
   */
  it('Property 1: Token persistence and inclusion', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random session tokens (alphanumeric strings)
        fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
        // Generate random user data
        fc.record({
          id: fc.integer({ min: 1, max: 1000000 }),
          email: fc.emailAddress(),
          username: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
        }),
        // Generate random expiration dates (in the future)
        fc.date({ min: new Date(Date.now() + 60000) }), // At least 1 minute in the future
        async (sessionToken, user, expiresAt) => {
          // Clear all mocks before each property test iteration
          vi.clearAllMocks();

          const mockAuthResponse = {
            user,
            sessionToken,
            expiresAt: expiresAt.toISOString(),
          };

          vi.mocked(authApi.signIn).mockResolvedValue({
            data: mockAuthResponse,
            status: 200,
          });

          vi.mocked(tokenStorage.getToken).mockReturnValue(null);

          const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
          });

          // Perform sign in
          await act(async () => {
            await result.current.signIn({
              email: user.email,
              password: 'test-password',
            });
          });

          // Property 1: Token should be persisted in storage
          expect(tokenStorage.setToken).toHaveBeenCalledWith(
            sessionToken,
            expiresAt.toISOString()
          );

          // Property 2: Token should be included in API client for subsequent requests
          expect(apiClient.setAuthToken).toHaveBeenCalledWith(sessionToken);

          // Property 3: User should be authenticated
          expect(result.current.isAuthenticated).toBe(true);
          expect(result.current.user).toEqual(user);
        }
      ),
      { numRuns: 100 } // Run 100 iterations with different random inputs
    );
  });
});
