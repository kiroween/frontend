"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { OfflineBanner } from "@/components/common/OfflineBanner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <OfflineBanner />
        {children}
      </AuthProvider>
    </ToastProvider>
  );
}
