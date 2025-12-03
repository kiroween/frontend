/**
 * Time Capsule API Service
 */

import { apiClient } from "./client";

import {
  TimeCapsule,
  CreateTimeCapsuleRequest,
  UpdateTimeCapsuleRequest,
  ShareTimeCapsuleRequest,
  ShareTimeCapsuleResponse,
  InviteCollaboratorRequest,
  RemoveCollaboratorRequest,
  ApiResponse,
} from "../types";

export const timeCapsuleApi = {
  /**
   * Create a new time capsule
   */
  create: async (
    data: CreateTimeCapsuleRequest
  ): Promise<ApiResponse<TimeCapsule>> => {
    return apiClient.post<TimeCapsule>("/api/timecapsules", data);
  },

  /**
   * Get a time capsule by ID
   */
  getById: async (id: string): Promise<ApiResponse<TimeCapsule>> => {
    return apiClient.get<TimeCapsule>(`/api/timecapsules/${id}`);
  },

  /**
   * Get all time capsules for the current user
   */
  getAll: async (): Promise<ApiResponse<TimeCapsule[]>> => {
    return apiClient.get<TimeCapsule[]>("/api/timecapsules");
  },

  /**
   * Update a time capsule
   */
  update: async (
    id: string,
    data: UpdateTimeCapsuleRequest
  ): Promise<ApiResponse<TimeCapsule>> => {
    return apiClient.put<TimeCapsule>(`/api/timecapsules/${id}`, data);
  },

  /**
   * Delete a time capsule
   */
  delete: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.delete<{ success: boolean }>(`/api/timecapsules/${id}`);
  },

  /**
   * Generate a share link for a time capsule
   */
  share: async (
    data: ShareTimeCapsuleRequest
  ): Promise<ApiResponse<ShareTimeCapsuleResponse>> => {
    return apiClient.post<ShareTimeCapsuleResponse>(
      "/api/timecapsules/share",
      data
    );
  },

  /**
   * Invite a collaborator to a time capsule
   */
  inviteCollaborator: async (
    data: InviteCollaboratorRequest
  ): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.post<{ success: boolean }>(
      "/api/timecapsules/invite",
      data
    );
  },

  /**
   * Remove a collaborator from a time capsule
   */
  removeCollaborator: async (
    data: RemoveCollaboratorRequest
  ): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.post<{ success: boolean }>(
      "/api/timecapsules/remove-collaborator",
      data
    );
  },
};
