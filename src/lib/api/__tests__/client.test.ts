/**
 * API Client Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import { ApiClient } from '../client';
import { ApiErrorCode } from '../../types/api';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient({
      baseUrl: 'https://api.test.com',
      timeout: 5000,
    });

    // Clear all mocks
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Error Handling', () => {
    it('should handle 404 errors correctly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ 
          status: 404,
          error: { message: 'Not found' }
        }),
      });

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.NOT_FOUND);
        expect(error.statusCode).toBe(404);
      }
    });

    it('should handle 401 unauthorized errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ 
          status: 401,
          error: { message: 'Unauthorized' }
        }),
      });

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
      }
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('fetch failed'));

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.NETWORK_ERROR);
      }
    });

    it('should handle timeout errors', async () => {
      const slowClient = new ApiClient({
        baseUrl: 'https://api.test.com',
        timeout: 100,
      });

      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 200)
          )
      );

      try {
        await slowClient.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.TIMEOUT);
      }
    });

    // Unit tests for error messages (Requirements: 5.4, 7.3, 7.4)
    describe('Error Messages', () => {
      it('should display Korean network error message', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

        try {
          await client.get('/test');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.code).toBe(ApiErrorCode.NETWORK_ERROR);
          expect(error.message).toBe('Please check your network connection. Verify your internet connection or try again later.');
          expect(error.message).toContain('network');
        }
      });

      it('should display Korean network error message for various network errors', async () => {
        const networkErrors = [
          'fetch failed',
          'NetworkError when attempting to fetch resource',
          'Failed to fetch',
          'Network request failed',
          'TypeError: Failed to fetch'
        ];

        for (const errorMsg of networkErrors) {
          global.fetch = vi.fn().mockRejectedValue(new Error(errorMsg));

          try {
            await client.get('/test');
            expect.fail('Should have thrown an error');
          } catch (error: any) {
            expect(error.code).toBe(ApiErrorCode.NETWORK_ERROR);
            expect(error.message).toContain('network');
            expect(error.message).toContain('connection');
          }
        }
      });

      it('should display Korean timeout error message', async () => {
        const slowClient = new ApiClient({
          baseUrl: 'https://api.test.com',
          timeout: 100,
        });

        global.fetch = vi.fn().mockImplementation(
          () =>
            new Promise(resolve =>
              setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 200)
            )
        );

        try {
          await slowClient.get('/test');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.code).toBe(ApiErrorCode.TIMEOUT);
          expect(error.message).toBe('Request timed out. Please try again later.');
          expect(error.message).toContain('timed out');
        }
      });

      it('should display Korean server error message for 500 errors', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({
            status: 500,
            error: {}
          }),
        });

        try {
          await client.get('/test');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.code).toBe(ApiErrorCode.SERVER_ERROR);
          expect(error.message).toBe('Server error occurred. Please try again later.');
          expect(error.statusCode).toBe(500);
        }
      });

      it('should display Korean server error message for 502 errors', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 502,
          json: async () => ({
            status: 502,
            error: {}
          }),
        });

        try {
          await client.get('/test');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.code).toBe(ApiErrorCode.SERVER_ERROR);
          expect(error.message).toBe('Server error occurred. Please try again later.');
          expect(error.statusCode).toBe(502);
        }
      });

      it('should display Korean server error message for 503 errors', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 503,
          json: async () => ({
            status: 503,
            error: {}
          }),
        });

        try {
          await client.get('/test');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.code).toBe(ApiErrorCode.SERVER_ERROR);
          expect(error.message).toBe('Server error occurred. Please try again later.');
          expect(error.statusCode).toBe(503);
        }
      });

      it('should display Korean server error message for 504 errors', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 504,
          json: async () => ({
            status: 504,
            error: {}
          }),
        });

        try {
          await client.get('/test');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.code).toBe(ApiErrorCode.SERVER_ERROR);
          expect(error.message).toBe('Server error occurred. Please try again later.');
          expect(error.statusCode).toBe(504);
        }
      });

      it('should preserve backend Korean error message for server errors', async () => {
        const backendMessage = 'Database connection failed';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({
            status: 500,
            error: {
              message: backendMessage
            }
          }),
        });

        try {
          await client.get('/test');
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.code).toBe(ApiErrorCode.SERVER_ERROR);
          expect(error.message).toBe(backendMessage);
        }
      });
    });
  });

  describe('HTTP Methods', () => {
    it('should make GET requests', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          status: 200,
          data: { result: mockData }
        }),
      });

      const response = await client.get('/test');

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should make POST requests with body', async () => {
      const mockData = { id: 1 };
      const postData = { name: 'Test' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({
          status: 201,
          data: { result: mockData }
        }),
      });

      const response = await client.post('/test', postData);

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(201);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        })
      );
    });
  });

  describe('Authentication', () => {
    it('should set auth token in headers', () => {
      client.setAuthToken('test-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          status: 200,
          data: { result: {} }
        }),
      });

      client.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should remove auth token', () => {
      client.setAuthToken('test-token');
      client.removeAuthToken();

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          status: 200,
          data: { result: {} }
        }),
      });

      client.get('/test');

      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].headers.Authorization).toBeUndefined();
    });

    it('should call unauthorized handler on 401 response', async () => {
      const unauthorizedHandler = vi.fn();
      client.setUnauthorizedHandler(unauthorizedHandler);
      client.setAuthToken('test-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({
          status: 401,
          error: { message: 'Unauthorized' }
        }),
      });

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
        expect(unauthorizedHandler).toHaveBeenCalledTimes(1);
      }
    });

    it('should remove auth token on 401 response', async () => {
      client.setAuthToken('test-token');

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({
          status: 401,
          error: { message: 'Unauthorized' }
        }),
      });

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        // Make another request to verify token was removed
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({
            status: 200,
            data: { result: {} }
          }),
        });

        await client.get('/test');

        const call = (global.fetch as any).mock.calls[0];
        expect(call[1].headers.Authorization).toBeUndefined();
      }
    });

    it('should remove localStorage token on 401 response', async () => {
      // Set token in localStorage
      localStorage.setItem('timegrave_session_token', 'test-token');
      localStorage.setItem('timegrave_token_expires_at', new Date(Date.now() + 3600000).toISOString());

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({
          status: 401,
          error: { message: 'Unauthorized' }
        }),
      });

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        // Verify localStorage tokens were removed
        expect(localStorage.getItem('timegrave_session_token')).toBeNull();
        expect(localStorage.getItem('timegrave_token_expires_at')).toBeNull();
      }
    });
  });

  describe('Backend Response Format', () => {
    it('should unwrap backend success response format', async () => {
      const mockResult = { id: 1, name: 'Test' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          status: 200,
          data: {
            result: mockResult,
            response: 'Success message'
          }
        }),
      });

      const response = await client.get('/test');

      expect(response.data).toEqual(mockResult);
      expect(response.message).toBe('Success message');
      expect(response.status).toBe(200);
    });

    it('should extract error from backend error format', async () => {
      const koreanErrorMessage = 'Time capsule not found';
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({
          status: 404,
          error: {
            code: 'NOT_FOUND',
            message: koreanErrorMessage
          }
        }),
      });

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.NOT_FOUND);
        expect(error.message).toBe(koreanErrorMessage);
        expect(error.statusCode).toBe(404);
      }
    });

    it('should handle backend error with details', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          status: 400,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: { field: 'email', reason: 'invalid format' }
          }
        }),
      });

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.VALIDATION_ERROR);
        expect(error.message).toBe('Invalid input');
        expect(error.details).toEqual({ field: 'email', reason: 'invalid format' });
      }
    });

    it('should use default error message when backend does not provide one', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          status: 500,
          error: {}
        }),
      });

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.SERVER_ERROR);
        expect(error.message).toBe('Server error occurred. Please try again later.');
      }
    });

    it('should handle response with message field instead of response field', async () => {
      const mockResult = { id: 1 };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          status: 200,
          data: {
            result: mockResult,
            message: 'Alternative message field'
          }
        }),
      });

      const response = await client.get('/test');

      expect(response.data).toEqual(mockResult);
      expect(response.message).toBe('Alternative message field');
    });

    it('should handle legacy response format (backward compatibility)', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const response = await client.get('/test');

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
    });
  });

  describe('Property-Based Tests', () => {
    /**
     * Feature: backend-api-integration, Property 8: Success response unwrapping
     * 
     * For any successful backend response in the format {status, data: {result}},
     * the API client should extract and return only the result data.
     * 
     * Validates: Requirements 5.1, 5.3
     */
    it('Property 8: Success response unwrapping', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            value: fc.oneof(fc.string(), fc.integer(), fc.boolean()),
            nested: fc.option(fc.record({
              field1: fc.string(),
              field2: fc.integer()
            }), { nil: undefined })
          }),
          fc.integer({ min: 200, max: 299 }),
          fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
          async (resultData, statusCode, message) => {
            // Arrange: Create backend response format
            const backendResponse = {
              status: statusCode,
              data: {
                result: resultData,
                ...(message ? { response: message } : {})
              }
            };

            global.fetch = vi.fn().mockResolvedValue({
              ok: true,
              status: statusCode,
              json: async () => backendResponse,
            });

            // Act: Make request
            const response = await client.get('/test');

            // Assert: Verify unwrapping
            expect(response.data).toEqual(resultData);
            expect(response.status).toBe(statusCode);
            if (message) {
              expect(response.message).toBe(message);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: backend-api-integration, Property 9: Error response extraction
     * 
     * For any error response in the format {status, error: {code, message}},
     * the API client should extract the error information and create an appropriate ApiError object.
     * 
     * Validates: Requirements 5.2
     */
    it('Property 9: Error response extraction', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(400, 401, 403, 404, 422, 500, 502, 503),
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
          fc.option(fc.record({
            field: fc.string(),
            reason: fc.string()
          }), { nil: undefined }),
          async (statusCode, errorMessage, errorCode, errorDetails) => {
            // Arrange: Create backend error response format
            const backendErrorResponse = {
              status: statusCode,
              error: {
                ...(errorCode ? { code: errorCode } : {}),
                message: errorMessage,
                ...(errorDetails ? { details: errorDetails } : {})
              }
            };

            global.fetch = vi.fn().mockResolvedValue({
              ok: false,
              status: statusCode,
              json: async () => backendErrorResponse,
            });

            // Act & Assert: Make request and verify error extraction
            try {
              await client.get('/test');
              expect.fail('Should have thrown an error');
            } catch (error: any) {
              // Verify error code mapping
              expect(error.code).toBeDefined();
              expect(Object.values(ApiErrorCode)).toContain(error.code);
              
              // Verify error message extraction
              expect(error.message).toBe(errorMessage);
              
              // Verify status code
              expect(error.statusCode).toBe(statusCode);
              
              // Verify details if provided
              if (errorDetails) {
                expect(error.details).toEqual(errorDetails);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: backend-api-integration, Property 11: Backend error message passthrough
     * 
     * For any Korean error message returned by the backend, the frontend should
     * display it to the user without modification.
     * 
     * Validates: Requirements 7.2
     */
    it('Property 11: Backend error message passthrough', async () => {
      // Korean error messages that backend might return
      const koreanMessages = [
        'Time capsule not found',
        'Access denied',
        'Invalid input',
        'Invalid email format',
        'Password does not match',
        'Email already exists',
        'Unlock date must be in the future',
        'Title is required',
        'Content cannot exceed 1000 characters',
        'Server error occurred'
      ];

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...koreanMessages),
          fc.constantFrom(400, 401, 403, 404, 422, 500),
          async (koreanMessage, statusCode) => {
            // Arrange: Create backend error response with Korean message
            const backendErrorResponse = {
              status: statusCode,
              error: {
                code: 'ERROR_CODE',
                message: koreanMessage
              }
            };

            global.fetch = vi.fn().mockResolvedValue({
              ok: false,
              status: statusCode,
              json: async () => backendErrorResponse,
            });

            // Act & Assert: Make request and verify Korean message is preserved
            try {
              await client.get('/test');
              expect.fail('Should have thrown an error');
            } catch (error: any) {
              // Verify the Korean message is passed through without modification
              expect(error.message).toBe(koreanMessage);
              
              // Verify it's not replaced with a default English message
              expect(error.message).not.toMatch(/error|failed|invalid/i);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: backend-api-integration, Property 10: Error message localization
     * 
     * For any API error type, the frontend should display an appropriate Korean error message to the user.
     * 
     * Validates: Requirements 7.1
     */
    it('Property 10: Error message localization', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate all possible error codes
          fc.constantFrom(
            ApiErrorCode.NETWORK_ERROR,
            ApiErrorCode.UNAUTHORIZED,
            ApiErrorCode.FORBIDDEN,
            ApiErrorCode.NOT_FOUND,
            ApiErrorCode.VALIDATION_ERROR,
            ApiErrorCode.SERVER_ERROR,
            ApiErrorCode.TIMEOUT,
            ApiErrorCode.UNKNOWN
          ),
          async (errorCode) => {
            // Create a test client
            const testClient = new ApiClient({
              baseUrl: 'https://api.test.com',
              timeout: 100,
            });

            let caughtError: any = null;

            // Arrange & Act: Trigger different error types based on error code
            try {
              switch (errorCode) {
                case ApiErrorCode.NETWORK_ERROR:
                  // Simulate network error
                  global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
                  await testClient.get('/test');
                  break;

                case ApiErrorCode.TIMEOUT:
                  // Simulate timeout by making request take longer than timeout
                  global.fetch = vi.fn().mockImplementation(
                    () => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 200))
                  );
                  await testClient.get('/test');
                  break;

                case ApiErrorCode.UNAUTHORIZED:
                  global.fetch = vi.fn().mockResolvedValue({
                    ok: false,
                    status: 401,
                    json: async () => ({ status: 401, error: {} }),
                  });
                  await testClient.get('/test');
                  break;

                case ApiErrorCode.FORBIDDEN:
                  global.fetch = vi.fn().mockResolvedValue({
                    ok: false,
                    status: 403,
                    json: async () => ({ status: 403, error: {} }),
                  });
                  await testClient.get('/test');
                  break;

                case ApiErrorCode.NOT_FOUND:
                  global.fetch = vi.fn().mockResolvedValue({
                    ok: false,
                    status: 404,
                    json: async () => ({ status: 404, error: {} }),
                  });
                  await testClient.get('/test');
                  break;

                case ApiErrorCode.VALIDATION_ERROR:
                  global.fetch = vi.fn().mockResolvedValue({
                    ok: false,
                    status: 400,
                    json: async () => ({ status: 400, error: {} }),
                  });
                  await testClient.get('/test');
                  break;

                case ApiErrorCode.SERVER_ERROR:
                  global.fetch = vi.fn().mockResolvedValue({
                    ok: false,
                    status: 500,
                    json: async () => ({ status: 500, error: {} }),
                  });
                  await testClient.get('/test');
                  break;

                case ApiErrorCode.UNKNOWN:
                  // Simulate unknown error
                  global.fetch = vi.fn().mockRejectedValue(new Error('Unknown error'));
                  await testClient.get('/test');
                  break;
              }
              expect.fail('Should have thrown an error');
            } catch (error: any) {
              caughtError = error;
            }

            // Assert: Verify error has appropriate Korean message
            expect(caughtError).toBeDefined();
            expect(caughtError.code).toBe(errorCode);
            expect(caughtError.message).toBeDefined();
            expect(typeof caughtError.message).toBe('string');
            expect(caughtError.message.length).toBeGreaterThan(0);

            // Verify the message is in Korean (contains Korean characters)
            // Korean characters are in Unicode range \uAC00-\uD7AF (Hangul Syllables)
            const hasKorean = /[\uAC00-\uD7AF]/.test(caughtError.message);
            expect(hasKorean).toBe(true);

            // Verify specific expected messages for each error type
            switch (errorCode) {
              case ApiErrorCode.NETWORK_ERROR:
                expect(caughtError.message).toContain('network');
                break;
              case ApiErrorCode.UNAUTHORIZED:
                expect(caughtError.message).toContain('Login');
                break;
              case ApiErrorCode.FORBIDDEN:
                expect(caughtError.message).toContain('permission');
                break;
              case ApiErrorCode.NOT_FOUND:
                expect(caughtError.message).toContain('not found');
                break;
              case ApiErrorCode.VALIDATION_ERROR:
                expect(caughtError.message).toContain('input');
                break;
              case ApiErrorCode.SERVER_ERROR:
                expect(caughtError.message).toContain('server error');
                break;
              case ApiErrorCode.TIMEOUT:
                expect(caughtError.message).toContain('timed out');
                break;
              case ApiErrorCode.UNKNOWN:
                expect(caughtError.message).toContain('unknown error');
                break;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: backend-api-integration, Property 2: Unauthorized redirect
     * 
     * For any API request that returns a 401 Unauthorized status, the application
     * should redirect the user to the login page.
     * 
     * Validates: Requirements 1.5
     */
    it('Property 2: Unauthorized redirect', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate random API endpoints
          fc.constantFrom('/api/graves', '/api/graves/123', '/api/users', '/api/users/sign-out'),
          // Generate random HTTP methods
          fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
          // Generate random error messages
          fc.string({ minLength: 1, maxLength: 100 }),
          // Generate random request bodies (for POST/PUT)
          fc.option(fc.record({
            field1: fc.string(),
            field2: fc.integer()
          }), { nil: undefined }),
          async (endpoint, method, errorMessage, requestBody) => {
            // Create a fresh client for each test iteration
            const testClient = new ApiClient({
              baseUrl: 'https://api.test.com',
              timeout: 5000,
            });

            // Set up unauthorized handler spy
            const unauthorizedHandler = vi.fn();
            testClient.setUnauthorizedHandler(unauthorizedHandler);

            // Set an auth token (simulating authenticated state)
            const authToken = `token-${Math.random().toString(36).substring(7)}`;
            testClient.setAuthToken(authToken);

            // Arrange: Create 401 Unauthorized response
            const unauthorizedResponse = {
              status: 401,
              error: {
                code: 'UNAUTHORIZED',
                message: errorMessage
              }
            };

            global.fetch = vi.fn().mockResolvedValue({
              ok: false,
              status: 401,
              json: async () => unauthorizedResponse,
            });

            // Act & Assert: Make request and verify unauthorized handling
            try {
              switch (method) {
                case 'GET':
                  await testClient.get(endpoint);
                  break;
                case 'POST':
                  await testClient.post(endpoint, requestBody);
                  break;
                case 'PUT':
                  await testClient.put(endpoint, requestBody);
                  break;
                case 'DELETE':
                  await testClient.delete(endpoint);
                  break;
              }
              expect.fail('Should have thrown an error');
            } catch (error: any) {
              // Property 1: Error should be UNAUTHORIZED
              expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
              
              // Property 2: Unauthorized handler should be called (redirect to login)
              expect(unauthorizedHandler).toHaveBeenCalledTimes(1);
              
              // Property 3: Token should be removed from localStorage
              expect(localStorage.getItem('timegrave_session_token')).toBeNull();
              expect(localStorage.getItem('timegrave_token_expires_at')).toBeNull();
              
              // Property 4: Subsequent requests should not include auth token
              global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({
                  status: 200,
                  data: { result: {} }
                }),
              });

              await testClient.get('/test');
              
              const fetchCall = (global.fetch as any).mock.calls[0];
              expect(fetchCall[1].headers.Authorization).toBeUndefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
