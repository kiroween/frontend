"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/Button";
import { 
  Bell, 
  Gift, 
  UserPlus, 
  Clock, 
  Users,
  CheckCheck,
  X 
} from "lucide-react";
import { NotificationType } from "@/lib/types";
import Link from "next/link";

interface NotificationListProps {
  onClose?: () => void;
}

export function NotificationList({ onClose }: NotificationListProps) {
  const { notifications, markAsRead, markAllAsRead, isLoading } = useNotifications();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "capsule_opened":
        return <Gift size={20} className="text-[var(--seal-gold)]" />;
      case "invited":
        return <UserPlus size={20} className="text-soul-blue" />;
      case "content_added":
        return <Bell size={20} className="text-green-400" />;
      case "reminder":
        return <Clock size={20} className="text-orange-400" />;
      case "collaborator_joined":
      case "collaborator_left":
        return <Users size={20} className="text-stone-400" />;
      default:
        return <Bell size={20} className="text-stone-400" />;
    }
  };

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    } else if (notification.timeCapsuleId) {
      window.location.href = `/view/${notification.timeCapsuleId}`;
    }
    
    onClose?.();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-stone-600 border-t-soul-blue rounded-full mx-auto"></div>
        <p className="text-stone-500 text-sm mt-4">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-700 flex items-center justify-between">
        <h3 className="font-cinzel text-lg text-stone-200">알림</h3>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.isRead) && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="ghost"
              size="sm"
              className="text-xs flex items-center gap-1"
            >
              <CheckCheck size={14} />
              모두 읽음
            </Button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={48} className="text-stone-600 mx-auto mb-4" />
            <p className="text-stone-500">알림이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-800">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full p-4 text-left transition-colors hover:bg-stone-800/50 ${
                  !notification.isRead ? "bg-stone-800/30" : ""
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`text-sm font-medium ${
                        !notification.isRead ? "text-stone-200" : "text-stone-400"
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 bg-soul-blue rounded-full mt-1"></span>
                      )}
                    </div>
                    
                    <p className="text-sm text-stone-500 mb-2">
                      {notification.message}
                    </p>

                    {notification.timeCapsuleTitle && (
                      <p className="text-xs text-stone-600 mb-2">
                        📦 {notification.timeCapsuleTitle}
                      </p>
                    )}

                    <p className="text-xs text-stone-600">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-stone-700">
          <Link href="/notifications">
            <Button variant="ghost" size="sm" className="w-full text-sm">
              All Notifications 보기
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return new Date(date).toLocaleDateString("ko-KR");
  } else if (days > 0) {
    return `${days}days 전`;
  } else if (hours > 0) {
    return `${hours}시간 전`;
  } else if (minutes > 0) {
    return `${minutes}분 전`;
  } else {
    return "방금 전";
  }
}
