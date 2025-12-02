"use client";

import { Button } from "@/components/ui/Button";
import { TimeCapsule } from "@/lib/types/timecapsule";

interface ContentViewerProps {
  timeCapsule: TimeCapsule;
  daysRemaining?: number;
  onRebury?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export function ContentViewer({
  timeCapsule,
  daysRemaining,
  onRebury,
  onDownload,
  onShare,
}: ContentViewerProps) {
  const isLocked = timeCapsule.status === "locked";
  const title = timeCapsule.title;
  const message = timeCapsule.description;
  const date = timeCapsule.createdAt.toLocaleDateString("en-US");
  const files = timeCapsule.contents;
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Sepia Filter Overlay */}
      <div className="relative bg-gradient-to-b from-amber-50 to-amber-100 border-8 border-amber-900/30 rounded-lg p-8 shadow-2xl">
        {/* Old Photo Effect */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1IiAvPjwvc3ZnPg==')] opacity-30 pointer-events-none rounded-lg" />

        <div className="relative space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-amber-900/20 pb-6">
            <h2 className="font-cinzel text-4xl text-amber-900 mb-2">
              {title}
            </h2>
            <p className="text-amber-700 text-sm">Sealed on: {date}</p>
            <p className="text-amber-600 text-xs mt-1">
              Resurrected on: {new Date().toLocaleDateString("en-US")}
            </p>
          </div>

          {/* Message or Locked Status */}
          {isLocked ? (
            <div className="bg-stone-900/50 border-2 border-stone-700 rounded-lg p-6">
              <div className="text-center space-y-4">
                <div className="text-6xl">🔒</div>
                <h3 className="font-cinzel text-2xl text-stone-300">
                  Sealed Memory
                </h3>
                <p className="text-stone-400">
                  This time capsule is still locked
                </p>
                {daysRemaining !== undefined && (
                  <div className="space-y-2">
                    <p className="text-[var(--soul-blue)] text-4xl font-bold">
                      {daysRemaining}days
                    </p>
                    <p className="text-stone-500 text-sm">remaining</p>
                  </div>
                )}
                <p className="text-stone-500 text-sm">
                  Unlock date:{" "}
                  {timeCapsule.openDate.toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/50 border-2 border-amber-900/20 rounded-lg p-6">
              <h3 className="font-cinzel text-xl text-amber-900 mb-4">
                Message from the past
              </h3>
              <p className="text-amber-800 whitespace-pre-wrap leading-relaxed">
                {message}
              </p>
            </div>
          )}

          {/* Files - Only show if unlocked */}
          {!isLocked && files.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl text-amber-900">
                Sealed Memory들 ({files.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((file, index) => (
                  <div
                    key={file.id || index}
                    className="bg-amber-50/50 border-2 border-amber-900/20 rounded-lg p-4 hover:border-amber-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {file.type === "image" ? "🖼️" : "📄"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-amber-900 font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-amber-700 text-xs">{file.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions - Only show full actions if unlocked */}
          <div className="flex gap-4 pt-6 border-t-2 border-amber-900/20">
            {!isLocked ? (
              <>
                {onShare && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={onShare}
                    className="flex-1 bg-amber-100 text-amber-900 border-2 border-amber-900/30 hover:bg-amber-200"
                  >
                    🔗 Share
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onDownload}
                  className="flex-1 bg-amber-100 text-amber-900 border-2 border-amber-900/30 hover:bg-amber-200"
                >
                  💾 Download
                </Button>
                <Button
                  variant="seal"
                  size="lg"
                  onClick={onRebury}
                  className="flex-1"
                >
                  🪦 Rebury
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => window.history.back()}
                className="flex-1 bg-stone-800 text-stone-300 border-2 border-stone-700 hover:bg-stone-700"
              >
                ← Go Back
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Time Rot Effect */}
      <div className="text-center text-amber-700/60 text-sm italic">
        &ldquo;Memories remain even as time passes&rdquo;
      </div>
    </div>
  );
}
