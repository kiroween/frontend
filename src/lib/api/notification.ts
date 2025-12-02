/**
 * Notification API Service
 */

import { apiClient } from "./client";
import {
  Notification,
  NotificationPreferences,
  CreateNotificationRequest,
  ApiResponse,
} from "../types";

export const notificationApi = {
  /**
   * Get all notifications for the current user
   */
  getAll: async (): Promise<ApiResponse<Notification[]>> => {
    return apiClient.get<Notification[]>("/api/notifications");
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (
    notificationId: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.put<{ success: boolean }>(
      `/api/notifications/${notificationId}/read`
    );
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.put<{ success: boolean }>("/api/notifications/read-all");
  },

  /**
   * Get notification preferences
   */
  getPreferences: async (): Promise<ApiResponse<NotificationPreferences>> => {
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
    return apiClient.post<Notification>("/api/notifications", data);
  },
};
