"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Notification, NotificationPreferences } from "@/lib/types";
import { notificationApi } from "@/lib/api";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  updatePreferences: (preferences: NotificationPreferences) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications and preferences on mount
  useEffect(() => {
    // Only load if API URL is configured
    if (process.env.NEXT_PUBLIC_API_URL) {
      loadNotifications();
      loadPreferences();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationApi.getAll();
      setNotifications(response.data);
    } catch (error) {
      // Silently fail if notification API is not available
      console.debug("Notification API not available:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const response = await notificationApi.getPreferences();
      setPreferences(response.data);
    } catch (error) {
      // Silently fail if notification API is not available
      console.debug("Notification preferences API not available:", error);
    }
  };

  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      await notificationApi.updatePreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error("Failed to update preferences:", error);
      throw error;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    markAsRead,
    markAllAsRead,
    addNotification,
    updatePreferences,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
