"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import { ResurrectionAnimation } from "@/components/resurrection/ResurrectionAnimation";
import { ContentViewer } from "@/components/resurrection/ContentViewer";
import { ShareButton } from "@/components/share";
import { DownloadButton } from "@/components/download";
import { TimeCapsule } from "@/lib/types/timecapsule";
import { gravesApi } from "@/lib/api/graves";
import { useToast } from "@/contexts/ToastContext";
import { ApiError, ApiErrorCode } from "@/lib/types/api";

/**
 * Calculate days remaining until unlock date
 */
function calculateDaysRemaining(openDate: Date): number {
  const now = new Date();
  const diff = openDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function ViewPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [capsuleData, setCapsuleData] = useState<TimeCapsule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch time capsule data on mount
  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await gravesApi.getById(params.id as string);
        setCapsuleData(response.data);
      } catch (err) {
        const apiError = err as ApiError;

        // Handle specific error codes
        if (apiError.code === ApiErrorCode.NOT_FOUND) {
          setError("Time capsule not found");
          showToast("Time capsule not found", "error");
        } else if (apiError.code === ApiErrorCode.FORBIDDEN) {
          setError("Access denied");
          showToast("Access denied", "error");
        } else {
          setError(apiError.message || "Failed to load time capsule");
          showToast(apiError.message || "Failed to load time capsule", "error");
        }

        // Redirect to graveyard after showing error
        setTimeout(() => {
          router.push("/graveyard");
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCapsule();
    }
  }, [params.id, router, showToast]);

  const daysRemaining =
    capsuleData?.status === "locked"
      ? calculateDaysRemaining(capsuleData.openDate)
      : undefined;

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setShowContent(true);
  };

  const handleRebury = () => {
    // TODO: Rebury logic
    router.push("/graveyard");
  };

  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
        <SoulParticles />
        <FogEffect />
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse">⏳</div>
            <p className="text-[var(--soul-blue)] text-xl">
              Loading time capsule...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error || !capsuleData) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
        <SoulParticles />
        <FogEffect />
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-6xl">❌</div>
            <p className="text-red-400 text-xl">
              {error || "Failed to load time capsule"}
            </p>
            <p className="text-stone-400 text-sm">Returning to graveyard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      {!showContent && <SoulParticles />}
      {!showContent && <FogEffect />}

      {showAnimation && (
        <ResurrectionAnimation onComplete={handleAnimationComplete} />
      )}

      {showContent && (
        <div className="relative z-20 min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
          <div className="container mx-auto px-4 py-16">
            <ContentViewer
              timeCapsule={capsuleData}
              daysRemaining={daysRemaining}
              onRebury={handleRebury}
              onDownload={handleDownload}
              onShare={handleShare}
            />

            {/* Share and Download Modals - Only show if unlocked */}
            {capsuleData.status === "unlocked" && (
              <div className="fixed bottom-8 right-8 flex gap-4 z-50">
                {showShareModal && (
                  <ShareButton
                    timeCapsuleId={capsuleData.id}
                    title={capsuleData.title}
                    variant="seal"
                    size="lg"
                  />
                )}
                {showDownloadModal && (
                  <DownloadButton
                    timeCapsuleId={capsuleData.id}
                    contents={capsuleData.contents}
                    timeCapsuleTitle={capsuleData.title}
                    timeCapsuleDescription={capsuleData.description}
                    openDate={capsuleData.openDate}
                    variant="seal"
                    size="lg"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
