"use client";

import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import { TimeCapsuleContent, DownloadOptions } from "@/lib/types";

const DownloadModal = lazy(() =>
  import("./DownloadModal").then((mod) => ({ default: mod.DownloadModal }))
);

interface DownloadButtonProps {
  timeCapsuleId: string;
  contents: TimeCapsuleContent[];
  timeCapsuleTitle?: string;
  timeCapsuleDescription?: string;
  openDate?: Date;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  variant?: "primary" | "seal" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function DownloadButton({
  timeCapsuleId,
  contents,
  timeCapsuleTitle,
  timeCapsuleDescription,
  openDate,
  onDownloadStart,
  onDownloadComplete,
  variant = "ghost",
  size = "md",
  className = "",
}: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleDownload = async (options: DownloadOptions) => {
    onDownloadStart?.();
    // The actual download will be handled by the modal
    // After download completes, the modal will call onDownloadComplete
  };

  if (contents.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
      >
        <Download size={16} />
        다운로드
      </Button>

      {isOpen && (
        <Suspense fallback={null}>
          <DownloadModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            contents={contents}
            metadata={{
              timeCapsuleId,
              title: timeCapsuleTitle || "Time Capsule",
              description: timeCapsuleDescription || "",
              openDate: openDate || new Date(),
              downloadedAt: new Date(),
              contents,
            }}
            onDownloadComplete={onDownloadComplete}
          />
        </Suspense>
      )}
    </>
  );
}
