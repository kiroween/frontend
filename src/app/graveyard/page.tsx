"use client";

import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";

export default function GraveyardPage() {
  const tombstones = [
    { id: 1, date: "2030-10-31", locked: true, daysLeft: 1805 },
    { id: 2, date: "2026-12-25", locked: false, daysLeft: 0 },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      <SoulParticles />
      <FogEffect />

      <div className="relative z-20 container mx-auto px-4 py-12">
        <h1 className="text-5xl text-center mb-12 text-gray-300">나의 묘지</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tombstones.map((tomb) => (
            <div
              key={tomb.id}
              className="tombstone-card border-4 border-gray-700 rounded-lg p-6 bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm hover:border-[var(--soul-blue)] transition-all duration-300"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">{tomb.locked ? "🔒" : "✨"}</div>
                <div className="text-2xl text-gray-300">{tomb.date}</div>
                <div className="text-gray-400">
                  {tomb.locked ? `${tomb.daysLeft}일 남음` : "부활 가능"}
                </div>
                {!tomb.locked && (
                  <button className="mt-4 px-6 py-2 bg-[var(--seal-gold)] text-black font-bold rounded-md hover:bg-yellow-500 transition-all">
                    열기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
