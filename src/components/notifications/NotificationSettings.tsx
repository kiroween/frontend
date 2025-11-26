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
      setSaveMessage("설정이 저장되었습니다.");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage("설정 저장에 실패했습니다.");
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      alert("이 브라우저는 푸시 알림을 지원하지 않습니다.");
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      setSettings((prev) => ({ ...prev, pushEnabled: true }));
      alert("푸시 알림이 활성화되었습니다!");
    } else {
      alert("푸시 알림 권한이 거부되었습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes("실패") 
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
          알림 유형
        </h3>
        
        <div className="space-y-4">
          <ToggleItem
            label="타임캡슐 오픈"
            description="타임캡슐이 열릴 때 알림을 받습니다"
            checked={settings.capsuleOpened}
            onChange={() => handleToggle("capsuleOpened")}
          />

          <ToggleItem
            label="초대 알림"
            description="타임캡슐에 초대되었을 때 알림을 받습니다"
            checked={settings.invitations}
            onChange={() => handleToggle("invitations")}
          />

          <ToggleItem
            label="콘텐츠 추가"
            description="협력자가 콘텐츠를 추가했을 때 알림을 받습니다"
            checked={settings.contentAdded}
            onChange={() => handleToggle("contentAdded")}
          />

          <ToggleItem
            label="리마인더"
            description="타임캡슐 오픈 전 리마인더를 받습니다"
            checked={settings.reminders}
            onChange={() => handleToggle("reminders")}
          />

          <ToggleItem
            label="협력자 활동"
            description="협력자가 참여하거나 나갔을 때 알림을 받습니다"
            checked={settings.collaboratorActivity}
            onChange={() => handleToggle("collaboratorActivity")}
          />
        </div>
      </div>

      {/* Delivery Methods */}
      <div className="bg-stone-900/50 border border-stone-700 rounded-lg p-6">
        <h3 className="font-cinzel text-xl text-stone-200 mb-4">
          알림 방식
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-stone-800/50 rounded-lg">
            <Smartphone size={24} className="text-soul-blue flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-stone-200 font-medium">푸시 알림</h4>
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
                브라우저 푸시 알림으로 실시간 알림을 받습니다
              </p>
              {!settings.pushEnabled && (
                <Button
                  onClick={requestPushPermission}
                  variant="ghost"
                  size="sm"
                  className="text-sm"
                >
                  권한 요청
                </Button>
              )}
            </div>
          </div>

          <ToggleItem
            icon={<Mail size={24} className="text-green-400" />}
            label="이메일 알림"
            description="이메일로 알림을 받습니다"
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
          {isSaving ? "저장 중..." : "설정 저장"}
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
