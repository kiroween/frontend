/**
 * Token Storage Utility Tests
 * Requirements: 1.3, 1.4
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenStorage } from '../tokenStorage';

describe('Token Storage Utility', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // Reset localStorage before each test
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  describe('setToken and getToken', () => {
    it('should store and retrieve a token', () => {
      const token = 'test-token-123';
      const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

      tokenStorage.setToken(token, expiresAt);
      const retrievedToken = tokenStorage.getToken();

      expect(retrievedToken).toBe(token);
    });

    it('should return null when no token is stored', () => {
      const retrievedToken = tokenStorage.getToken();
      expect(retrievedToken).toBeNull();
    });

    it('should store token with expiration time', () => {
      const token = 'test-token-456';
      const expiresAt = new Date(Date.now() + 3600000).toISOString();

      tokenStorage.setToken(token, expiresAt);

      expect(localStorageMock.getItem('timegrave_session_token')).toBe(token);
      expect(localStorageMock.getItem('timegrave_token_expires_at')).toBe(expiresAt);
    });

    it('should overwrite existing token when setting a new one', () => {
      const token1 = 'old-token';
      const token2 = 'new-token';
      const expiresAt1 = new Date(Date.now() + 3600000).toISOString();
      const expiresAt2 = new Date(Date.now() + 7200000).toISOString();

      tokenStorage.setToken(token1, expiresAt1);
      tokenStorage.setToken(token2, expiresAt2);

      const retrievedToken = tokenStorage.getToken();
      expect(retrievedToken).toBe(token2);
    });
  });

  describe('removeToken', () => {
    it('should remove stored token', () => {
      const token = 'test-token-789';
      const expiresAt = new Date(Date.now() + 3600000).toISOString();

      tokenStorage.setToken(token, expiresAt);
      tokenStorage.removeToken();

      const retrievedToken = tokenStorage.getToken();
      expect(retrievedToken).toBeNull();
    });

    it('should remove both token and expiration time', () => {
      const token = 'test-token-abc';
      const expiresAt = new Date(Date.now() + 3600000).toISOString();

      tokenStorage.setToken(token, expiresAt);
      tokenStorage.removeToken();

      expect(localStorageMock.getItem('timegrave_session_token')).toBeNull();
      expect(localStorageMock.getItem('timegrave_token_expires_at')).toBeNull();
    });

    it('should not throw error when removing non-existent token', () => {
      expect(() => tokenStorage.removeToken()).not.toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for non-expired token', () => {
      const token = 'test-token-def';
      const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

      tokenStorage.setToken(token, expiresAt);

      expect(tokenStorage.isTokenExpired()).toBe(false);
    });

    it('should return true for expired token', () => {
      const token = 'test-token-ghi';
      const expiresAt = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago

      tokenStorage.setToken(token, expiresAt);

      expect(tokenStorage.isTokenExpired()).toBe(true);
    });

    it('should return true when no expiration time is set', () => {
      const token = 'test-token-jkl';
      localStorageMock.setItem('timegrave_session_token', token);
      // Don't set expiration time

      expect(tokenStorage.isTokenExpired()).toBe(true);
    });

    it('should return true when token expires exactly now', () => {
      const token = 'test-token-mno';
      const expiresAt = new Date().toISOString(); // Expires right now

      tokenStorage.setToken(token, expiresAt);

      expect(tokenStorage.isTokenExpired()).toBe(true);
    });
  });

  describe('automatic token expiration handling', () => {
    it('should return null and remove token when getting expired token', () => {
      const token = 'expired-token';
      const expiresAt = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago

      tokenStorage.setToken(token, expiresAt);
      const retrievedToken = tokenStorage.getToken();

      expect(retrievedToken).toBeNull();
      expect(localStorageMock.getItem('timegrave_session_token')).toBeNull();
      expect(localStorageMock.getItem('timegrave_token_expires_at')).toBeNull();
    });

    it('should not remove token when checking expiration without getting token', () => {
      const token = 'expired-token-2';
      const expiresAt = new Date(Date.now() - 3600000).toISOString();

      tokenStorage.setToken(token, expiresAt);
      tokenStorage.isTokenExpired();

      // Token should still be in storage (not automatically removed by isTokenExpired)
      expect(localStorageMock.getItem('timegrave_session_token')).toBe(token);
    });
  });

  describe('edge cases', () => {
    it('should handle invalid expiration date format', () => {
      const token = 'test-token-pqr';
      localStorageMock.setItem('timegrave_session_token', token);
      localStorageMock.setItem('timegrave_token_expires_at', 'invalid-date');

      // Invalid date should be treated as expired
      expect(tokenStorage.isTokenExpired()).toBe(true);
    });

    it('should handle very long token strings', () => {
      const longToken = 'a'.repeat(10000);
      const expiresAt = new Date(Date.now() + 3600000).toISOString();

      tokenStorage.setToken(longToken, expiresAt);
      const retrievedToken = tokenStorage.getToken();

      expect(retrievedToken).toBe(longToken);
    });

    it('should handle special characters in token', () => {
      const specialToken = 'token-with-special-chars-!@#$%^&*()_+-=[]{}|;:,.<>?';
      const expiresAt = new Date(Date.now() + 3600000).toISOString();

      tokenStorage.setToken(specialToken, expiresAt);
      const retrievedToken = tokenStorage.getToken();

      expect(retrievedToken).toBe(specialToken);
    });

    it('should handle empty string as token', () => {
      const emptyToken = '';
      const expiresAt = new Date(Date.now() + 3600000).toISOString();

      tokenStorage.setToken(emptyToken, expiresAt);
      const retrievedToken = tokenStorage.getToken();

      expect(retrievedToken).toBe(emptyToken);
    });
  });

  describe('server-side rendering compatibility', () => {
    it('should handle missing window object gracefully', () => {
      // Save original window
      const originalWindow = global.window;

      // Remove window to simulate SSR
      // @ts-expect-error - Intentionally setting to undefined for SSR test
      global.window = undefined;

      expect(() => {
        tokenStorage.getToken();
        tokenStorage.setToken('token', new Date().toISOString());
        tokenStorage.removeToken();
        tokenStorage.isTokenExpired();
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });
  });
});
