"use client";

import { ReactNode } from "react";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { OfflineBanner } from "@/components/common/OfflineBanner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <NotificationProvider>
        <OfflineBanner />
        {children}
      </NotificationProvider>
    </ToastProvider>
  );
}
