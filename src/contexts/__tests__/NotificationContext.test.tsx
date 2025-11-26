/**
 * NotificationContext Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { NotificationProvider, useNotifications } from '../NotificationContext';
import * as api from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  notificationApi: {
    getAll: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    getPreferences: vi.fn(),
    updatePreferences: vi.fn(),
  },
}));

// Test component that uses the context
function TestComponent() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div>
      <div data-testid="unread-count">{unreadCount}</div>
      <div data-testid="notification-count">{notifications.length}</div>
      {notifications.map((n) => (
        <div key={n.id} data-testid={`notification-${n.id}`}>
          {n.title}
        </div>
      ))}
      <button onClick={() => markAsRead('test-1')}>Mark Read</button>
      <button onClick={markAllAsRead}>Mark All Read</button>
    </div>
  );
}

describe('NotificationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load notifications on mount', async () => {
    const mockNotifications = [
      {
        id: 'test-1',
        type: 'capsule_opened' as const,
        title: 'Test Notification',
        message: 'Test message',
        isRead: false,
        createdAt: new Date(),
      },
    ];

    (api.notificationApi.getAll as any).mockResolvedValue({
      data: mockNotifications,
      status: 200,
    });

    (api.notificationApi.getPreferences as any).mockResolvedValue({
      data: {
        capsuleOpened: true,
        invitations: true,
        contentAdded: true,
        reminders: true,
        collaboratorActivity: true,
        pushEnabled: false,
        emailEnabled: true,
      },
      status: 200,
    });

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    });
  });

  it('should mark notification as read', async () => {
    const mockNotifications = [
      {
        id: 'test-1',
        type: 'capsule_opened' as const,
        title: 'Test Notification',
        message: 'Test message',
        isRead: false,
        createdAt: new Date(),
      },
    ];

    (api.notificationApi.getAll as any).mockResolvedValue({
      data: mockNotifications,
      status: 200,
    });

    (api.notificationApi.getPreferences as any).mockResolvedValue({
      data: {},
      status: 200,
    });

    (api.notificationApi.markAsRead as any).mockResolvedValue({
      data: { success: true },
      status: 200,
    });

    const { getByText } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    });

    act(() => {
      getByText('Mark Read').click();
    });

    await waitFor(() => {
      expect(api.notificationApi.markAsRead).toHaveBeenCalledWith('test-1');
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });
  });

  it('should mark all notifications as read', async () => {
    const mockNotifications = [
      {
        id: 'test-1',
        type: 'capsule_opened' as const,
        title: 'Test 1',
        message: 'Message 1',
        isRead: false,
        createdAt: new Date(),
      },
      {
        id: 'test-2',
        type: 'invited' as const,
        title: 'Test 2',
        message: 'Message 2',
        isRead: false,
        createdAt: new Date(),
      },
    ];

    (api.notificationApi.getAll as any).mockResolvedValue({
      data: mockNotifications,
      status: 200,
    });

    (api.notificationApi.getPreferences as any).mockResolvedValue({
      data: {},
      status: 200,
    });

    (api.notificationApi.markAllAsRead as any).mockResolvedValue({
      data: { success: true },
      status: 200,
    });

    const { getByText } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('2');
    });

    act(() => {
      getByText('Mark All Read').click();
    });

    await waitFor(() => {
      expect(api.notificationApi.markAllAsRead).toHaveBeenCalled();
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });
  });
});
