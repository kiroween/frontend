/**
 * Time Capsule API Service
 */

import { apiClient } from './client';
import { mockTimeCapsuleApi } from './mock';
import {
  TimeCapsule,
  CreateTimeCapsuleRequest,
  UpdateTimeCapsuleRequest,
  ShareTimeCapsuleRequest,
  ShareTimeCapsuleResponse,
  InviteCollaboratorRequest,
  RemoveCollaboratorRequest,
  ApiResponse,
} from '../types';

// Determine if we should use mock API
const useMock = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

export const timeCapsuleApi = {
  /**
   * Create a new time capsule
   */
  create: async (data: CreateTimeCapsuleRequest): Promise<ApiResponse<TimeCapsule>> => {
    if (useMock) {
      return mockTimeCapsuleApi.create(data);
    }

    return apiClient.post<TimeCapsule>('/api/timecapsules', data);
  },

  /**
   * Get a time capsule by ID
   */
  getById: async (id: string): Promise<ApiResponse<TimeCapsule>> => {
    if (useMock) {
      return mockTimeCapsuleApi.getById(id);
    }

    return apiClient.get<TimeCapsule>(`/api/timecapsules/${id}`);
  },

  /**
   * Get all time capsules for the current user
   */
  getAll: async (): Promise<ApiResponse<TimeCapsule[]>> => {
    if (useMock) {
      return mockTimeCapsuleApi.getAll();
    }

    return apiClient.get<TimeCapsule[]>('/api/timecapsules');
  },

  /**
   * Update a time capsule
   */
  update: async (
    id: string,
    data: UpdateTimeCapsuleRequest
  ): Promise<ApiResponse<TimeCapsule>> => {
    if (useMock) {
      // Mock implementation would go here
      throw new Error('Not implemented in mock');
    }

    return apiClient.put<TimeCapsule>(`/api/timecapsules/${id}`, data);
  },

  /**
   * Delete a time capsule
   */
  delete: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    if (useMock) {
      return mockTimeCapsuleApi.delete(id);
    }

    return apiClient.delete<{ success: boolean }>(`/api/timecapsules/${id}`);
  },

  /**
   * Generate a share link for a time capsule
   */
  share: async (
    data: ShareTimeCapsuleRequest
  ): Promise<ApiResponse<ShareTimeCapsuleResponse>> => {
    if (useMock) {
      return mockTimeCapsuleApi.share(data);
    }

    return apiClient.post<ShareTimeCapsuleResponse>('/api/timecapsules/share', data);
  },

  /**
   * Invite a collaborator to a time capsule
   */
  inviteCollaborator: async (
    data: InviteCollaboratorRequest
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (useMock) {
      // Mock implementation would go here
      throw new Error('Not implemented in mock');
    }

    return apiClient.post<{ success: boolean }>('/api/timecapsules/invite', data);
  },

  /**
   * Remove a collaborator from a time capsule
   */
  removeCollaborator: async (
    data: RemoveCollaboratorRequest
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (useMock) {
      // Mock implementation would go here
      throw new Error('Not implemented in mock');
    }

    return apiClient.post<{ success: boolean }>('/api/timecapsules/remove-collaborator', data);
  },
};
