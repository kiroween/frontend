/**
 * Notification related types
 */

export type NotificationType = 
  | 'capsule_opened' 
  | 'invited' 
  | 'content_added' 
  | 'reminder'
  | 'collaborator_joined'
  | 'collaborator_left';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeCapsuleId?: string;
  timeCapsuleTitle?: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  capsuleOpened: boolean;
  invitations: boolean;
  contentAdded: boolean;
  reminders: boolean;
  collaboratorActivity: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export interface CreateNotificationRequest {
  type: NotificationType;
  title: string;
  message: string;
  timeCapsuleId?: string;
  userId: string;
}

export interface UpdateNotificationRequest {
  notificationId: string;
  isRead: boolean;
}

export interface NotificationSettings {
  userId: string;
  preferences: NotificationPreferences;
}
