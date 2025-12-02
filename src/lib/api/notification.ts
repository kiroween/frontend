/**
 * Notification API Service
 */

import { apiClient } from "./client";
import {
  Notification,
  NotificationPreferences,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  ApiResponse,
} from "../types";

// Determine if we should use mock API
const useMock =
  process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL;

export const notificationApi = {
  /**
   * Get all notifications for the current user
   */
  getAll: async (): Promise<ApiResponse<Notification[]>> => {
    if (useMock) {
      return mockNotificationApi.getAll();
    }

    return apiClient.get<Notification[]>("/api/notifications");
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (
    notificationId: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (useMock) {
      return mockNotificationApi.markAsRead(notificationId);
    }

    return apiClient.put<{ success: boolean }>(
      `/api/notifications/${notificationId}/read`
    );
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<ApiResponse<{ success: boolean }>> => {
    if (useMock) {
      return mockNotificationApi.markAllAsRead();
    }

    return apiClient.put<{ success: boolean }>("/api/notifications/read-all");
  },

  /**
   * Get notification preferences
   */
  getPreferences: async (): Promise<ApiResponse<NotificationPreferences>> => {
    if (useMock) {
      return mockNotificationApi.getPreferences();
    }

    return apiClient.get<NotificationPreferences>(
      "/api/notifications/preferences"
    );
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (
    preferences: NotificationPreferences
  ): Promise<ApiResponse<NotificationPreferences>> => {
    if (useMock) {
      return mockNotificationApi.updatePreferences(preferences);
    }

    return apiClient.put<NotificationPreferences>(
      "/api/notifications/preferences",
      preferences
    );
  },

  /**
   * Create a new notification (admin/system use)
   */
  create: async (
    data: CreateNotificationRequest
  ): Promise<ApiResponse<Notification>> => {
    if (useMock) {
      // Mock implementation would go here
      throw new Error("Not implemented in mock");
    }

    return apiClient.post<Notification>("/api/notifications", data);
  },
};
