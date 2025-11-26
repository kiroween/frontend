"use client";

import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      {/* Background Effects */}
      <SoulParticles />
      <FogEffect />

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-8 px-4 animate-fade-in">
          {/* Stone Gate */}
          <div className="stone-gate relative border-4 border-stone-700/80 rounded-lg p-8 md:p-16 bg-gradient-to-b from-stone-800/20 to-stone-900/30 backdrop-blur-md shadow-2xl">
            {/* Ancient Runes Decoration */}
            <div className="absolute top-4 left-4 text-stone-600 text-xs opacity-50">⚝</div>
            <div className="absolute top-4 right-4 text-stone-600 text-xs opacity-50">⚝</div>
            <div className="absolute bottom-4 left-4 text-stone-600 text-xs opacity-50">⚝</div>
            <div className="absolute bottom-4 right-4 text-stone-600 text-xs opacity-50">⚝</div>

            <h1 className="font-cinzel text-5xl md:text-8xl tracking-[0.3em] text-stone-300 mb-12 drop-shadow-[0_0_20px_rgba(74,144,226,0.3)]">
              TIMEGRAVE
            </h1>

            <div className="space-y-6 text-stone-400 text-lg md:text-xl mb-12">
              <p className="font-cinzel italic">&ldquo;과거를 묻고,&rdquo;</p>
              <p className="font-cinzel italic">&ldquo;미래를 부활하라&rdquo;</p>
            </div>

            <p className="text-stone-500 text-sm mb-8 max-w-md mx-auto">
              기억의 사후 세계에 오신 것을 환영합니다.
              <br />
              당신의 과거를 봉인하고, 정해진 시간에 부활시키세요.
            </p>

            <Link href="/graveyard">
              <Button variant="seal" size="lg" className="animate-slide-up">
                ENTER GRAVE
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stone-gate {
          animation: stoneRise 1.5s ease-out;
        }

        @keyframes stoneRise {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
