"use client";

import { Button } from "@/components/ui/Button";
import { TimeCapsule } from "@/lib/types/timecapsule";

interface TombstoneCardProps {
  timeCapsule: TimeCapsule;
  daysRemaining?: number;
  onOpen?: () => void;
}

export function TombstoneCard({
  timeCapsule,
  daysRemaining,
  onOpen,
}: TombstoneCardProps) {
  const locked = timeCapsule.status === "locked";
  const daysLeft = daysRemaining || 0;
  const date = timeCapsule.openDate.toLocaleDateString("en-US");
  const title = timeCapsule.title;
  return (
    <div
      className={`
        group relative tombstone-card
        border-4 rounded-lg p-8
        bg-gradient-to-b backdrop-blur-md
        transition-all duration-500
        ${
          locked
            ? "border-stone-700/80 from-stone-900/60 to-stone-950/80 hover:border-stone-600"
            : "border-[var(--soul-blue)]/50 from-stone-800/40 to-stone-900/60 hover:border-[var(--soul-blue)]"
        }
      `}
    >
      {/* Tombstone Shape */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-16 bg-stone-800 rounded-t-full border-4 border-stone-700" />

      {/* Lock/Unlock Visual */}
      <div className="text-center mb-6">
        {locked ? (
          <div className="relative">
            <div className="text-7xl opacity-80">⛓️</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl">🔒</div>
            </div>
          </div>
        ) : (
          <div className="relative animate-soul-glow">
            <div className="text-7xl">💀</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl animate-pulse">✨</div>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      {title && (
        <h3 className="font-cinzel text-xl text-stone-300 text-center mb-4 truncate">
          {title}
        </h3>
      )}

      {/* Date */}
      <div className="font-cinzel text-3xl text-stone-400 text-center mb-4 tracking-wider">
        {date}
      </div>

      {/* Status */}
      <div className="text-center mb-6">
        {locked ? (
          <div className="space-y-2">
            <p className="text-stone-500 text-sm">Sealed Memory</p>
            <p className="text-[var(--soul-blue)] text-2xl font-bold">
              {daysLeft}days
            </p>
            <p className="text-stone-600 text-xs">remaining</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[var(--soul-blue)] text-lg font-semibold animate-pulse">
              부활 가능
            </p>
            <p className="text-stone-500 text-xs">기억이 깨어나길 기다립니다</p>
          </div>
        )}
      </div>

      {/* Action Button */}
      {!locked && (
        <div className="text-center">
          <Button variant="seal" size="md" onClick={onOpen} className="w-full">
            부활하기
          </Button>
        </div>
      )}

      {/* Crack Effect for Unlocked */}
      {!locked && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-[var(--soul-blue)]/50 via-[var(--soul-blue)]/20 to-transparent transform -translate-x-1/2 rotate-12" />
          <div className="absolute top-0 left-1/3 w-0.5 h-2/3 bg-gradient-to-b from-[var(--soul-blue)]/30 to-transparent transform rotate-6" />
        </div>
      )}
    </div>
  );
}
