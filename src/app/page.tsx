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
          <div className="relative border-4 border-stone-700/80 rounded-lg p-8 md:p-16 bg-gradient-to-b from-stone-800/20 to-stone-900/30 backdrop-blur-md shadow-2xl animate-[stoneRise_1.5s_ease-out]">
            {/* Ancient Runes Decoration */}
            <div className="absolute top-4 left-4 text-stone-600 text-xs opacity-50">
              ⚝
            </div>
            <div className="absolute top-4 right-4 text-stone-600 text-xs opacity-50">
              ⚝
            </div>
            <div className="absolute bottom-4 left-4 text-stone-600 text-xs opacity-50">
              ⚝
            </div>
            <div className="absolute bottom-4 right-4 text-stone-600 text-xs opacity-50">
              ⚝
            </div>

            <h1 className="font-cinzel text-5xl md:text-8xl tracking-[0.3em] text-stone-300 mb-12 drop-shadow-[0_0_20px_rgba(74,144,226,0.3)]">
              TIMEGRAVE
            </h1>

            <div className="space-y-6 text-stone-400 text-lg md:text-xl mb-12">
              <p className="font-cinzel italic">&ldquo;Bury the past,&rdquo;</p>
              <p className="font-cinzel italic">
                &ldquo;Resurrect the future&rdquo;
              </p>
            </div>

            <p className="text-stone-500 text-sm mb-8 max-w-md mx-auto">
              Welcome to the afterlife of memories.
              <br />
              Seal your past and resurrect it at the appointed time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button variant="seal" size="lg" className="animate-slide-up">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="seal"
                  size="lg"
                  className="animate-slide-up"
                  style={{ animationDelay: "100ms" }}
                >
                  Login
                </Button>
              </Link>
            </div>

            <div className="mt-6">
              <Link
                href="/graveyard"
                className="text-stone-500 hover:text-stone-400 text-sm transition-colors"
              >
                or Explore →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
