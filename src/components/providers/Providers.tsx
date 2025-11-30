"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { OfflineBanner } from "@/components/common/OfflineBanner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <OfflineBanner />
          {children}
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
