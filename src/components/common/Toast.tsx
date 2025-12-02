"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-400" />,
    error: <AlertCircle size={20} className="text-red-400" />,
    info: <Info size={20} className="text-soul-blue" />,
  };

  const styles = {
    success: "bg-green-900/90 border-green-700",
    error: "bg-red-900/90 border-red-700",
    info: "bg-stone-900/90 border-soul-blue",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${styles[type]} backdrop-blur-md shadow-lg animate-slide-up`}
    >
      {icons[type]}
      <p className="text-stone-200 text-sm flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-stone-400 hover:text-stone-200 transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
}
