"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-red-900/95 backdrop-blur-md border-b-2 border-red-700 py-3 px-4 animate-slide-down">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <WifiOff size={20} className="text-red-200" />
        <p className="text-red-100 text-sm font-medium">
          인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
