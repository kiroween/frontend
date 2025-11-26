"use client";

import { useEffect, useState } from "react";

interface ResurrectionAnimationProps {
  onComplete: () => void;
}

export function ResurrectionAnimation({ onComplete }: ResurrectionAnimationProps) {
  const [phase, setPhase] = useState<"crack" | "light" | "whiteout">("crack");

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("light"), 1500);
    const timer2 = setTimeout(() => setPhase("whiteout"), 3000);
    const timer3 = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Crack Phase */}
      {phase === "crack" && (
        <div className="absolute inset-0 bg-[var(--deep-void)] animate-fade-in">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="text-9xl animate-pulse">💀</div>
              {/* Crack Lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 200"
              >
                <line
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="200"
                  stroke="var(--soul-blue)"
                  strokeWidth="2"
                  className="animate-crack"
                />
                <line
                  x1="80"
                  y1="50"
                  x2="80"
                  y2="150"
                  stroke="var(--soul-blue)"
                  strokeWidth="1"
                  className="animate-crack"
                  style={{ animationDelay: "0.2s" }}
                />
                <line
                  x1="120"
                  y1="30"
                  x2="120"
                  y2="170"
                  stroke="var(--soul-blue)"
                  strokeWidth="1"
                  className="animate-crack"
                  style={{ animationDelay: "0.4s" }}
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Light Phase */}
      {phase === "light" && (
        <div className="absolute inset-0 bg-[var(--deep-void)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="text-9xl">💀</div>
              <div className="absolute inset-0 bg-[var(--soul-blue)] opacity-50 blur-3xl animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-full bg-gradient-to-b from-transparent via-[var(--soul-blue)] to-transparent animate-light-burst" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Whiteout Phase */}
      {phase === "whiteout" && (
        <div className="absolute inset-0 bg-white animate-whiteout" />
      )}

      <style jsx>{`
        @keyframes crack {
          from {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            opacity: 0;
          }
          to {
            stroke-dasharray: 200;
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes light-burst {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
          100% {
            transform: scaleY(1.5);
            opacity: 0;
          }
        }

        @keyframes whiteout {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-crack {
          animation: crack 1s ease-out forwards;
        }

        .animate-light-burst {
          animation: light-burst 1s ease-out infinite;
        }

        .animate-whiteout {
          animation: whiteout 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
