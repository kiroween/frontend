"use client";

import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      <SoulParticles />
      <FogEffect />

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-8 px-4">
          {/* Stone Gate */}
          <div className="stone-gate border-4 border-gray-700 rounded-lg p-12 bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
            <h1 className="text-6xl md:text-8xl tracking-[0.3em] text-gray-300 mb-8">
              TIMEGRAVE
            </h1>

            <div className="space-y-4 text-gray-400 text-lg">
              <p className="font-cinzel">&ldquo;과거를 묻고,&rdquo;</p>
              <p className="font-cinzel">&ldquo;미래를 부활하라&rdquo;</p>
            </div>

            <Link href="/graveyard">
              <button className="mt-12 px-8 py-4 bg-[var(--seal-gold)] text-black font-bold text-xl rounded-md hover:bg-yellow-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                ENTER GRAVE
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stone-gate {
          animation: fadeIn 2s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
