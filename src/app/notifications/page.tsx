"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationList } from "@/components/notifications/NotificationList";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { isLoading } = useNotifications();

  return (
    <main className="relative min-h-screen bg-[var(--deep-void)] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/graveyard">
              <Button variant="ghost" size="sm" className="mb-4 flex items-center gap-2">
                <ArrowLeft size={16} />
                Go Back
              </Button>
            </Link>
            
            <h1 className="font-cinzel text-4xl text-stone-200 mb-2">
              All Notifications
            </h1>
            <p className="text-stone-400">
              Check all your notifications
            </p>
          </div>

          <Link href="/settings/notifications">
            <Button variant="ghost" size="md" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </Button>
          </Link>
        </div>

        {/* Notification List */}
        <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-stone-700 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-20 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-stone-600 border-t-soul-blue rounded-full mx-auto"></div>
            </div>
          ) : (
            <NotificationList />
          )}
        </div>
      </div>
    </main>
  );
}
