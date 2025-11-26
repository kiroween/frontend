"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import { ResurrectionAnimation } from "@/components/resurrection/ResurrectionAnimation";
import { ContentViewer } from "@/components/resurrection/ContentViewer";
import { ShareButton } from "@/components/share";
import { DownloadButton } from "@/components/download";

export default function ViewPage() {
  const router = useRouter();
  const params = useParams();
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Mock data - TODO: API 연동
  const capsuleData = {
    id: params.id,
    title: "크리스마스 타임캡슐",
    message: `안녕, 미래의 나!

지금은 2024년 크리스마스야. 
올해는 정말 많은 일들이 있었지.

이 메시지를 읽고 있다면, 
그동안 어떤 일들이 있었는지 궁금하네.

과거의 나는 미래의 너를 응원해!`,
    date: "2024-12-25",
    files: [
      { name: "christmas_photo.jpg", url: "#", type: "image/jpeg" },
      { name: "memories.mp4", url: "#", type: "video/mp4" },
      { name: "letter.pdf", url: "#", type: "application/pdf" },
    ],
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setShowContent(true);
  };

  const handleRebury = () => {
    // TODO: 다시 묻기 로직
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

  // Convert files to TimeCapsuleContent format
  const contents = capsuleData.files.map((file, index) => ({
    id: `file-${index}`,
    type: file.type.startsWith("image/") ? "image" as const : "file" as const,
    name: file.name,
    url: file.url,
    size: 0, // TODO: Get actual size from API
    createdAt: new Date(),
  }));

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
              {...capsuleData}
              onRebury={handleRebury}
              onDownload={handleDownload}
              onShare={handleShare}
            />

            {/* Share and Download Modals */}
            <div className="fixed bottom-8 right-8 flex gap-4 z-50">
              {showShareModal && (
                <ShareButton
                  timeCapsuleId={String(capsuleData.id)}
                  title={capsuleData.title}
                  variant="seal"
                  size="lg"
                />
              )}
              {showDownloadModal && (
                <DownloadButton
                  timeCapsuleId={String(capsuleData.id)}
                  contents={contents}
                  timeCapsuleTitle={capsuleData.title}
                  timeCapsuleDescription={capsuleData.message}
                  openDate={new Date(capsuleData.date)}
                  variant="seal"
                  size="lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
