/**
 * Environment Configuration Tests
 * 
 * Tests to verify that the API client correctly uses environment variables
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../client';

describe('Environment Configuration', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Save original environment variable
    originalEnv = process.env.NEXT_PUBLIC_API_URL;
  });

  afterEach(() => {
    // Restore original environment variable
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
  });

  it('should use NEXT_PUBLIC_API_URL from environment when set', () => {
    // Arrange: Set environment variable
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';

    // Act: Create API client without explicit baseUrl
    const client = new ApiClient();

    // Assert: Verify the client uses the environment variable
    // We can verify this by checking the baseUrl through a request
    const testEndpoint = '/test';
    
    // Mock fetch to capture the URL
    let capturedUrl = '';
    global.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return new Response(JSON.stringify({ status: 200, data: { result: {} } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    // Make a request
    client.get(testEndpoint);

    // Wait a bit for the async operation
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(capturedUrl).toBe('http://localhost:8000/test');
        resolve();
      }, 100);
    });
  });

  it('should use empty baseUrl when NEXT_PUBLIC_API_URL is not set', () => {
    // Arrange: Remove environment variable
    delete process.env.NEXT_PUBLIC_API_URL;

    // Act: Create API client without explicit baseUrl
    const client = new ApiClient();

    // Assert: Verify the client uses empty baseUrl (relative URLs)
    let capturedUrl = '';
    global.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return new Response(JSON.stringify({ status: 200, data: { result: {} } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const testEndpoint = '/api/test';
    client.get(testEndpoint);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // When baseUrl is empty, the endpoint is used as-is
        expect(capturedUrl).toBe('/api/test');
        resolve();
      }, 100);
    });
  });

  it('should allow explicit baseUrl to override environment variable', () => {
    // Arrange: Set environment variable
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';

    // Act: Create API client with explicit baseUrl
    const client = new ApiClient({ baseUrl: 'https://api.production.com' });

    // Assert: Verify the explicit baseUrl takes precedence
    let capturedUrl = '';
    global.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return new Response(JSON.stringify({ status: 200, data: { result: {} } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const testEndpoint = '/test';
    client.get(testEndpoint);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(capturedUrl).toBe('https://api.production.com/test');
        resolve();
      }, 100);
    });
  });

  it('should use http://localhost:8000 when environment variable is set correctly', () => {
    // Arrange: Set environment variable to the expected value
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';

    // Act: Create API client
    const client = new ApiClient();

    // Assert: Make a request and verify the full URL
    let capturedUrl = '';
    global.fetch = async (url: string | URL | Request) => {
      capturedUrl = url.toString();
      return new Response(JSON.stringify({ status: 200, data: { result: {} } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    client.get('/api/graves');

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(capturedUrl).toBe('http://localhost:8000/api/graves');
        expect(capturedUrl).toContain('localhost:8000');
        resolve();
      }, 100);
    });
  });

  describe('Real API vs Mock API behavior', () => {
    it('should use real API when NEXT_PUBLIC_API_URL is set', () => {
      // Arrange: Set environment variable to backend URL
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';

      // Act: Create API client
      const client = new ApiClient();

      // Assert: Verify the client will make requests to the real backend
      let capturedUrl = '';
      global.fetch = async (url: string | URL | Request) => {
        capturedUrl = url.toString();
        return new Response(JSON.stringify({ status: 200, data: { result: {} } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      };

      client.get('/api/users/sign-in');

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Verify it's calling the real backend URL
          expect(capturedUrl).toBe('http://localhost:8000/api/users/sign-in');
          expect(capturedUrl).toMatch(/^http:\/\/localhost:8000/);
          resolve();
        }, 100);
      });
    });

    it('should use relative URLs when NEXT_PUBLIC_API_URL is not set', () => {
      // Arrange: Remove environment variable
      delete process.env.NEXT_PUBLIC_API_URL;

      // Act: Create API client
      const client = new ApiClient();

      // Assert: Verify the client uses relative URLs (which would hit Next.js API routes or fail)
      let capturedUrl = '';
      global.fetch = async (url: string | URL | Request) => {
        capturedUrl = url.toString();
        return new Response(JSON.stringify({ status: 200, data: { result: {} } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      };

      client.get('/api/users/sign-in');

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Verify it's using relative URLs (no domain)
          expect(capturedUrl).toBe('/api/users/sign-in');
          expect(capturedUrl).not.toMatch(/^http/);
          resolve();
        }, 100);
      });
    });

    it('should allow switching between real and mock API by changing environment variable', () => {
      // Test 1: With environment variable (real API)
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';
      const realClient = new ApiClient();

      let capturedUrl1 = '';
      global.fetch = async (url: string | URL | Request) => {
        capturedUrl1 = url.toString();
        return new Response(JSON.stringify({ status: 200, data: { result: {} } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      };

      realClient.get('/api/graves');

      // Test 2: Without environment variable (relative URLs)
      delete process.env.NEXT_PUBLIC_API_URL;
      const relativeClient = new ApiClient();

      let capturedUrl2 = '';
      global.fetch = async (url: string | URL | Request) => {
        capturedUrl2 = url.toString();
        return new Response(JSON.stringify({ status: 200, data: { result: {} } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      };

      relativeClient.get('/api/graves');

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Verify real API client uses full URL
          expect(capturedUrl1).toBe('http://localhost:8000/api/graves');
          
          // Verify relative client uses relative URL
          expect(capturedUrl2).toBe('/api/graves');
          
          resolve();
        }, 100);
      });
    });
  });
});
