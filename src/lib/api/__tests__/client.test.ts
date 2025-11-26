/**
 * API Client Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiClient } from '../client';
import { ApiErrorCode } from '../../types/api';

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient({
      baseUrl: 'https://api.test.com',
      timeout: 5000,
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('Error Handling', () => {
    it('should handle 404 errors correctly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
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
        json: async () => ({ message: 'Unauthorized' }),
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
  });

  describe('HTTP Methods', () => {
    it('should make GET requests', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
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
        json: async () => mockData,
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
        json: async () => ({}),
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
        json: async () => ({}),
      });

      client.get('/test');

      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].headers.Authorization).toBeUndefined();
    });
  });
});
