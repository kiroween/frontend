"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotificationSettingsPage() {
  const { preferences, updatePreferences, isLoading } = useNotifications();

  if (isLoading || !preferences) {
    return (
      <main className="relative min-h-screen bg-[var(--deep-void)] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-stone-600 border-t-soul-blue rounded-full"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[var(--deep-void)] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/graveyard">
            <Button variant="ghost" size="sm" className="mb-4 flex items-center gap-2">
              <ArrowLeft size={16} />
              Go Back
            </Button>
          </Link>
          
          <h1 className="font-cinzel text-4xl text-stone-200 mb-2">
            Notification Settings
          </h1>
          <p className="text-stone-400">
            Configure notification types and delivery methods
          </p>
        </div>

        {/* Settings */}
        <NotificationSettings
          settings={preferences}
          onUpdate={updatePreferences}
        />
      </div>
    </main>
  );
}
