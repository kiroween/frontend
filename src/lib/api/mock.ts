/**
 * Mock API for development
 */

import {
  TimeCapsule,
  CreateTimeCapsuleRequest,
  ShareTimeCapsuleResponse,
  ShareTimeCapsuleRequest,
  Notification,
  NotificationPreferences,
} from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock data storage (in-memory)
const mockTimeCapsules: TimeCapsule[] = [];
const mockNotifications: Notification[] = [];

export const mockTimeCapsuleApi = {
  async create(data: CreateTimeCapsuleRequest) {
    await delay(1000);

    const timeCapsule: TimeCapsule = {
      id: generateId(),
      title: data.title,
      description: data.description,
      openDate: data.openDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'mock-user-id',
      status: new Date() >= data.openDate ? 'unlocked' : 'locked',
      contents: [],
      collaborators: [
        {
          id: 'mock-user-id',
          name: 'You',
          email: 'you@example.com',
          role: 'owner' as const,
          joinedAt: new Date(),
        },
      ],
      isPublic: data.isPublic || false,
    };

    mockTimeCapsules.push(timeCapsule);

    return {
      data: timeCapsule,
      status: 201,
      message: '타임캡슐이 생성되었습니다.',
    };
  },

  async getById(id: string) {
    await delay(500);

    const timeCapsule = mockTimeCapsules.find(tc => tc.id === id);

    if (!timeCapsule) {
      throw {
        code: 'NOT_FOUND',
        message: '타임캡슐을 찾을 수 없습니다.',
        statusCode: 404,
      };
    }

    return {
      data: timeCapsule,
      status: 200,
    };
  },

  async getAll() {
    await delay(800);

    return {
      data: mockTimeCapsules,
      status: 200,
    };
  },

  async share(data: ShareTimeCapsuleRequest) {
    await delay(600);

    const shareId = generateId();
    const shareUrl = `${window.location.origin}/shared/${shareId}`;

    const response: ShareTimeCapsuleResponse = {
      shareUrl,
      shareId,
      expiresAt: data.expiresAt,
    };

    // Update the time capsule with share info
    const timeCapsule = mockTimeCapsules.find(tc => tc.id === data.timeCapsuleId);
    if (timeCapsule) {
      timeCapsule.shareUrl = shareUrl;
      timeCapsule.shareId = shareId;
    }

    return {
      data: response,
      status: 200,
      message: '공유 링크가 생성되었습니다.',
    };
  },

  async delete(id: string) {
    await delay(500);

    const index = mockTimeCapsules.findIndex(tc => tc.id === id);

    if (index === -1) {
      throw {
        code: 'NOT_FOUND',
        message: '타임캡슐을 찾을 수 없습니다.',
        statusCode: 404,
      };
    }

    mockTimeCapsules.splice(index, 1);

    return {
      data: { success: true },
      status: 200,
      message: '타임캡슐이 삭제되었습니다.',
    };
  },
};

export const mockNotificationApi = {
  async getAll() {
    await delay(500);

    return {
      data: mockNotifications,
      status: 200,
    };
  },

  async markAsRead(notificationId: string) {
    await delay(300);

    const notification = mockNotifications.find(n => n.id === notificationId);

    if (notification) {
      notification.isRead = true;
    }

    return {
      data: { success: true },
      status: 200,
    };
  },

  async markAllAsRead() {
    await delay(400);

    mockNotifications.forEach(n => {
      n.isRead = true;
    });

    return {
      data: { success: true },
      status: 200,
    };
  },

  async getPreferences() {
    await delay(300);

    const preferences: NotificationPreferences = {
      capsuleOpened: true,
      invitations: true,
      contentAdded: true,
      reminders: true,
      collaboratorActivity: true,
      pushEnabled: false,
      emailEnabled: true,
    };

    return {
      data: preferences,
      status: 200,
    };
  },

  async updatePreferences(preferences: NotificationPreferences) {
    await delay(400);

    return {
      data: preferences,
      status: 200,
      message: '알림 설정이 저장되었습니다.',
    };
  },
};

// Helper to add mock notifications (for testing)
export const addMockNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
  mockNotifications.push({
    ...notification,
    id: generateId(),
    createdAt: new Date(),
  });
};

// Initialize with some mock data
if (typeof window !== 'undefined') {
  // Add sample notifications
  addMockNotification({
    type: 'capsule_opened',
    title: '타임캡슐이 열렸습니다!',
    message: '"2024년의 추억" 타임캡슐을 확인해보세요.',
    timeCapsuleId: 'sample-1',
    timeCapsuleTitle: '2024년의 추억',
    isRead: false,
  });

  addMockNotification({
    type: 'invited',
    title: '타임캡슐 초대',
    message: 'John님이 "여름 휴가" 타임캡슐에 초대했습니다.',
    timeCapsuleId: 'sample-2',
    timeCapsuleTitle: '여름 휴가',
    isRead: false,
  });
}
