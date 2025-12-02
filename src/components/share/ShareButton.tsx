"use client";

import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { timeCapsuleApi } from "@/lib/api";
import { Share2 } from "lucide-react";

const ShareModalComponent = lazy(() => import("./ShareModal").then(mod => ({ default: mod.ShareModal })));

export type SharePlatform = "link" | "twitter" | "facebook" | "kakao" | "email";

interface ShareButtonProps {
  timeCapsuleId: string;
  title: string;
  onShare?: (platform: SharePlatform) => void;
  variant?: "primary" | "seal" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ShareButton({
  timeCapsuleId,
  title,
  onShare,
  variant = "ghost",
  size = "md",
  className = "",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareId, setShareId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await timeCapsuleApi.share({
        timeCapsuleId,
        permissions: "view",
      });

      setShareUrl(response.data.shareUrl);
      setShareId(response.data.shareId);
      setIsOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to create share link.");
      console.error("Share error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
      >
        <Share2 size={16} />
        {isLoading ? "Creating..." : "Share"}
      </Button>

      {error && (
        <div className="text-red-400 text-sm mt-2">
          {error}
        </div>
      )}

      {isOpen && (
        <Suspense fallback={null}>
          <ShareModalComponent
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            shareUrl={shareUrl}
            shareId={shareId}
            timeCapsuleTitle={title}
            onShare={onShare}
          />
        </Suspense>
      )}
    </>
  );
}
