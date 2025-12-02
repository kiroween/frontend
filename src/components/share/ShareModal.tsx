"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Copy, Check, X, Twitter, Facebook, Mail } from "lucide-react";
import { SharePlatform } from "./ShareButton";
import { Collaborator } from "@/lib/types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareId: string;
  timeCapsuleTitle: string;
  collaborators?: Collaborator[];
  onShare?: (platform: SharePlatform) => void;
}

export function ShareModal({
  isOpen,
  onClose,
  shareUrl,
  shareId,
  timeCapsuleTitle,
  collaborators = [],
  onShare,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSocialShare = (platform: SharePlatform) => {
    const text = `${timeCapsuleTitle} - Sharing time capsule from TimeGrave`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);

    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "kakao":
        // KakaoTalk sharing would require SDK integration
        alert("KakaoTalk sharing is coming soon.");
        return;
      case "email":
        url = `mailto:?subject=${encodedText}&body=${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
      onShare?.(platform);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-stone-700 rounded-lg shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-stone-700">
          <h2 className="font-cinzel text-2xl text-stone-200 mb-2">
            Share Time Capsule
          </h2>
          <p className="text-stone-400 text-sm">{timeCapsuleTitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Share Link */}
          <div>
            <label className="block text-stone-300 text-sm mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-stone-800 border border-stone-600 rounded text-stone-200 text-sm focus:outline-none focus:border-soul-blue"
              />
              <Button
                onClick={handleCopyLink}
                variant="seal"
                size="md"
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copy됨
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-green-400 text-xs mt-2">
                ✓ Copied to clipboard
              </p>
            )}
          </div>

          {/* Share ID */}
          <div>
            <label className="block text-stone-400 text-xs mb-1">Share ID</label>
            <p className="text-stone-500 text-xs font-mono">{shareId}</p>
          </div>

          {/* Social Share */}
          <div>
            <label className="block text-stone-300 text-sm mb-3">
              Share on Social Media
            </label>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleSocialShare("twitter")}
                className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded transition-colors"
                aria-label="Twitter로 Share"
              >
                <Twitter size={20} className="text-[#1DA1F2]" />
                <span className="text-xs text-stone-400">Twitter</span>
              </button>

              <button
                onClick={() => handleSocialShare("facebook")}
                className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook size={20} className="text-[#4267B2]" />
                <span className="text-xs text-stone-400">Facebook</span>
              </button>

              <button
                onClick={() => handleSocialShare("kakao")}
                className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded transition-colors"
                aria-label="Share on KakaoTalk"
              >
                <div className="w-5 h-5 bg-[#FEE500] rounded flex items-center justify-center">
                  <span className="text-[#3C1E1E] text-xs font-bold">K</span>
                </div>
                <span className="text-xs text-stone-400">Kakao</span>
              </button>

              <button
                onClick={() => handleSocialShare("email")}
                className="flex flex-col items-center gap-2 p-3 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded transition-colors"
                aria-label="Email로 Share"
              >
                <Mail size={20} className="text-stone-400" />
                <span className="text-xs text-stone-400">Email</span>
              </button>
            </div>
          </div>

          {/* Collaborators (if any) */}
          {collaborators.length > 0 && (
            <div>
              <label className="block text-stone-300 text-sm mb-2">
                Collaborators ({collaborators.length})
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3 p-2 bg-stone-800 rounded"
                  >
                    <div className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center">
                      <span className="text-stone-300 text-sm">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-stone-200 text-sm">
                        {collaborator.name}
                      </p>
                      <p className="text-stone-500 text-xs">
                        {collaborator.email}
                      </p>
                    </div>
                    <span className="text-xs text-stone-400 capitalize">
                      {collaborator.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-700">
          <Button
            onClick={onClose}
            variant="ghost"
            size="md"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
