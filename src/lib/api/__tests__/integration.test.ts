/**
 * Integration Tests for Backend API Integration
 * 
 * Tests the complete user flow:
 * 1. Sign up
 * 2. Sign in
 * 3. Create time capsule
 * 4. List time capsules
 * 5. View time capsule detail
 * 6. Error cases
 * 7. Sign out and 401 handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi } from '../auth';
import { gravesApi } from '../graves';
import { tokenStorage } from '../../auth/tokenStorage';

describe('Integration Tests: Complete User Flow', () => {
  beforeEach(() => {
    // Clear any stored tokens before each test
    tokenStorage.removeToken();
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('Happy Path: Sign up → Sign in → Create → List → View', () => {
    it('should complete the full user journey successfully', async () => {
      // Step 1: Sign up
      const signUpData = {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        username: 'TestUser',
      };

      const signUpResponse = await authApi.signUp(signUpData);
      expect(signUpResponse.status).toBe(201);
      expect(signUpResponse.data).toHaveProperty('id');
      expect(signUpResponse.data.email).toBe(signUpData.email);

      // Step 2: Sign in
      const signInData = {
        email: signUpData.email,
        password: signUpData.password,
      };

      const signInResponse = await authApi.signIn(signInData);
      expect(signInResponse.status).toBe(200);
      expect(signInResponse.data).toHaveProperty('sessionToken');
      expect(signInResponse.data).toHaveProperty('user');
      expect(signInResponse.data).toHaveProperty('expiresAt');

      // Verify token is stored
      const storedToken = tokenStorage.getToken();
      expect(storedToken).toBe(signInResponse.data.sessionToken);

      // Step 3: Create time capsule
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const createData = {
        title: 'Test Time Capsule',
        content: 'This is a test time capsule content',
        unlockDate: tomorrow,
      };

      const createResponse = await gravesApi.create(createData);
      expect(createResponse.status).toBe(201);
      expect(createResponse.data).toHaveProperty('id');
      expect(createResponse.data.title).toBe(createData.title);
      expect(createResponse.data.status).toBe('locked');
      expect(createResponse.data.openDate).toBeInstanceOf(Date);

      const capsuleId = createResponse.data.id;

      // Step 4: List time capsules
      const listResponse = await gravesApi.getAll();
      expect(listResponse.status).toBe(200);
      expect(Array.isArray(listResponse.data)).toBe(true);
      expect(listResponse.data.length).toBeGreaterThan(0);

      // Find our created capsule
      const foundCapsule = listResponse.data.find(c => c.id === capsuleId);
      expect(foundCapsule).toBeDefined();
      expect(foundCapsule?.title).toBe(createData.title);

      // Step 5: View time capsule detail
      const detailResponse = await gravesApi.getById(capsuleId);
      expect(detailResponse.status).toBe(200);
      expect(detailResponse.data.id).toBe(capsuleId);
      expect(detailResponse.data.title).toBe(createData.title);
      
      // Verify it's a locked capsule
      expect(detailResponse.data.status).toBe('locked');
      expect(detailResponse.data.openDate).toBeInstanceOf(Date);
    });
  });

  describe('Error Cases', () => {
    it('should handle invalid sign up data (400)', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123', // Too short
        username: '',
      };

      await expect(authApi.signUp(invalidData)).rejects.toThrow();
    });

    it('should handle invalid login credentials (401)', async () => {
      const invalidCredentials = {
        email: 'nonexistent@example.com',
        password: 'WrongPassword123!',
      };

      await expect(authApi.signIn(invalidCredentials)).rejects.toThrow();
    });

    it('should handle creating time capsule with past date (400)', async () => {
      // First sign in
      const signUpData = {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        username: 'TestUser',
      };
      await authApi.signUp(signUpData);
      await authApi.signIn({
        email: signUpData.email,
        password: signUpData.password,
      });

      // Try to create with past date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const invalidData = {
        title: 'Invalid Capsule',
        content: 'This should fail',
        unlockDate: yesterday,
      };

      await expect(gravesApi.create(invalidData)).rejects.toThrow();
    });

    it('should handle accessing non-existent time capsule (404)', async () => {
      // First sign in
      const signUpData = {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        username: 'TestUser',
      };
      await authApi.signUp(signUpData);
      await authApi.signIn({
        email: signUpData.email,
        password: signUpData.password,
      });

      // Try to access non-existent capsule
      await expect(gravesApi.getById(999999)).rejects.toThrow();
    });

    it('should handle accessing time capsule without authentication (401)', async () => {
      // Make sure no token is stored
      tokenStorage.removeToken();

      // Try to access without authentication
      await expect(gravesApi.getAll()).rejects.toThrow();
    });
  });

  describe('Sign out and Token Management', () => {
    it('should clear token on sign out', async () => {
      // Sign up and sign in
      const signUpData = {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        username: 'TestUser',
      };
      await authApi.signUp(signUpData);
      await authApi.signIn({
        email: signUpData.email,
        password: signUpData.password,
      });

      // Verify token is stored
      expect(tokenStorage.getToken()).toBeTruthy();

      // Sign out
      await authApi.signOut();

      // Verify token is cleared
      expect(tokenStorage.getToken()).toBeNull();
    });

    it('should handle 401 by clearing token', async () => {
      // Sign up and sign in
      const signUpData = {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        username: 'TestUser',
      };
      await authApi.signUp(signUpData);
      await authApi.signIn({
        email: signUpData.email,
        password: signUpData.password,
      });

      // Manually set an invalid token
      tokenStorage.setToken('invalid-token', new Date(Date.now() + 86400000).toISOString());

      // Try to make a request with invalid token
      try {
        await gravesApi.getAll();
      } catch (error) {
        // Token should be cleared on 401
        expect(tokenStorage.getToken()).toBeNull();
      }
    });
  });
});
