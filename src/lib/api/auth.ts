/**
 * Authentication API Service
 * 
 * Handles user authentication operations including sign up, sign in, sign out, and account deletion.
 * Requirements: 1.1, 1.2, 1.4
 */

import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { toSnakeCase, toCamelCase } from '../utils/typeConverter';

/**
 * Sign up request payload (frontend format)
 */
export interface SignUpRequest {
  email: string;
  password: string;
  username: string;
}

/**
 * Sign in request payload (frontend format)
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * User information returned from backend
 */
export interface User {
  id: number;
  email: string;
  username: string;
  createdAt?: string;
}

/**
 * Authentication response with session token
 */
export interface AuthResponse {
  user: User;
  sessionToken: string;
  expiresAt: string;
}

/**
 * Account deletion response
 */
export interface DeleteAccountResponse {
  deletedGravesCount: number;
}

/**
 * Authentication API service
 */
export const authApi = {
  /**
   * Sign up a new user
   * POST /api/users
   * 
   * @param data - User registration data
   * @returns User information
   */
  async signUp(data: SignUpRequest): Promise<ApiResponse<User>> {
    // Convert camelCase to snake_case for backend
    const backendData = toSnakeCase(data);
    
    const response = await apiClient.post<unknown>('/api/users', backendData);
    
    // Convert snake_case response to camelCase
    const user = toCamelCase<User>(response.data);
    
    return {
      ...response,
      data: user,
    };
  },

  /**
   * Sign in an existing user
   * POST /api/users/sign-in
   * 
   * @param data - User login credentials
   * @returns Authentication response with session token
   */
  async signIn(data: SignInRequest): Promise<ApiResponse<AuthResponse>> {
    // Convert camelCase to snake_case for backend
    const backendData = toSnakeCase(data);
    
    const response = await apiClient.post<unknown>('/api/users/sign-in', backendData);
    
    // Convert snake_case response to camelCase
    const authResponse = toCamelCase<AuthResponse>(response.data);
    
    return {
      ...response,
      data: authResponse,
    };
  },

  /**
   * Sign out the current user
   * POST /api/users/sign-out
   * 
   * @returns Empty response on success
   */
  async signOut(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/users/sign-out');
  },

  /**
   * Delete the current user's account
   * DELETE /api/users
   * 
   * @returns Information about deleted resources
   */
  async deleteAccount(): Promise<ApiResponse<DeleteAccountResponse>> {
    const response = await apiClient.delete<unknown>('/api/users');
    
    // Convert snake_case response to camelCase
    const deleteResponse = toCamelCase<DeleteAccountResponse>(response.data);
    
    return {
      ...response,
      data: deleteResponse,
    };
  },
};
