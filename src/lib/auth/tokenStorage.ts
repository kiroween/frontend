/**
 * Token Storage Utility
 * 
 * Manages session token storage in localStorage with expiration handling.
 * Requirements: 1.3, 1.4
 */

const TOKEN_KEY = 'timegrave_session_token';
const EXPIRES_AT_KEY = 'timegrave_token_expires_at';

export const tokenStorage = {
  /**
   * Retrieve the stored session token
   * @returns The session token or null if not found or expired
   */
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      return null;
    }

    // Check if token is expired
    if (this.isTokenExpired()) {
      this.removeToken();
      return null;
    }

    return token;
  },

  /**
   * Store the session token with expiration time
   * @param token - The session token to store
   * @param expiresAt - ISO 8601 datetime string indicating when the token expires
   */
  setToken(token: string, expiresAt: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
  },

  /**
   * Remove the stored session token and expiration time
   */
  removeToken(): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  },

  /**
   * Check if the stored token has expired
   * @returns true if the token is expired or expiration time is not set, false otherwise
   */
  isTokenExpired(): boolean {
    if (typeof window === 'undefined') {
      return true;
    }

    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
    
    if (!expiresAt) {
      return true;
    }

    const expirationDate = new Date(expiresAt);
    const now = new Date();

    return now >= expirationDate;
  },
};
