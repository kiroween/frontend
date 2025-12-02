"use client";

import { useState, useEffect } from "react";
import { NotificationPreferences } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Bell, Mail, Smartphone } from "lucide-react";

interface NotificationSettingsProps {
  settings: NotificationPreferences;
  onUpdate: (settings: NotificationPreferences) => Promise<void>;
}

export function NotificationSettings({ settings: initialSettings, onUpdate }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationPreferences>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await onUpdate(settings);
      setSaveMessage("Settings saved successfully.");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage("Failed to save settings.");
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support push notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      setSettings((prev) => ({ ...prev, pushEnabled: true }));
      alert("Push notifications enabled!");
    } else {
      alert("Push notification permission denied.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes("failed") 
            ? "bg-red-900/20 border border-red-700 text-red-400" 
            : "bg-green-900/20 border border-green-700 text-green-400"
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Notification Types */}
      <div className="bg-stone-900/50 border border-stone-700 rounded-lg p-6">
        <h3 className="font-cinzel text-xl text-stone-200 mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notification Types
        </h3>
        
        <div className="space-y-4">
          <ToggleItem
            label="Time Capsule Opens"
            description="Receive notifications when time capsules open"
            checked={settings.capsuleOpened}
            onChange={() => handleToggle("capsuleOpened")}
          />

          <ToggleItem
            label="Invitation Notifications"
            description="Receive notifications when invited to time capsules"
            checked={settings.invitations}
            onChange={() => handleToggle("invitations")}
          />

          <ToggleItem
            label="Content Added"
            description="Receive notifications when collaborators add content"
            checked={settings.contentAdded}
            onChange={() => handleToggle("contentAdded")}
          />

          <ToggleItem
            label="Reminders"
            description="Time Capsule Opens 전 Reminders를 받습니다"
            checked={settings.reminders}
            onChange={() => handleToggle("reminders")}
          />

          <ToggleItem
            label="Collaborator Activity"
            description="Receive notifications when collaborators join or leave"
            checked={settings.collaboratorActivity}
            onChange={() => handleToggle("collaboratorActivity")}
          />
        </div>
      </div>

      {/* Delivery Methods */}
      <div className="bg-stone-900/50 border border-stone-700 rounded-lg p-6">
        <h3 className="font-cinzel text-xl text-stone-200 mb-4">
          Notification Methods
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-stone-800/50 rounded-lg">
            <Smartphone size={24} className="text-soul-blue flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-stone-200 font-medium">Push Notifications</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushEnabled}
                    onChange={() => handleToggle("pushEnabled")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-soul-blue"></div>
                </label>
              </div>
              <p className="text-stone-500 text-sm mb-3">
                브라우저 Push Notifications으로 실시간 알림을 받습니다
              </p>
              {!settings.pushEnabled && (
                <Button
                  onClick={requestPushPermission}
                  variant="ghost"
                  size="sm"
                  className="text-sm"
                >
                  permission 요청
                </Button>
              )}
            </div>
          </div>

          <ToggleItem
            icon={<Mail size={24} className="text-green-400" />}
            label="Email 알림"
            description="Email로 알림을 받습니다"
            checked={settings.emailEnabled}
            onChange={() => handleToggle("emailEnabled")}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="seal"
          size="lg"
        >
          {isSaving ? "Save 중..." : "Settings Save"}
        </Button>
      </div>
    </div>
  );
}

interface ToggleItemProps {
  icon?: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleItem({ icon, label, description, checked, onChange }: ToggleItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-stone-800/50 rounded-lg">
      {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-stone-200 font-medium">{label}</h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-soul-blue"></div>
          </label>
        </div>
        <p className="text-stone-500 text-sm">{description}</p>
      </div>
    </div>
  );
}
