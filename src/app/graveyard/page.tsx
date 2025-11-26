"use client";

import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import { TombstoneCard } from "@/components/graveyard/TombstoneCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function GraveyardPage() {
  const tombstones = [
    {
      id: 1,
      date: "2030-10-31",
      locked: true,
      daysLeft: 1805,
      title: "할로윈의 추억",
    },
    {
      id: 2,
      date: "2026-12-25",
      locked: false,
      daysLeft: 0,
      title: "크리스마스 타임캡슐",
    },
    {
      id: 3,
      date: "2027-06-15",
      locked: true,
      daysLeft: 580,
      title: "여름의 약속",
    },
  ];

  const handleOpen = (id: number) => {
    window.location.href = `/view/${id}`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      <SoulParticles />
      <FogEffect />

      <div className="relative z-20 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="font-cinzel text-5xl md:text-6xl text-stone-300 mb-4 tracking-wider">
            나의 묘지
          </h1>
          <p className="text-stone-500 text-lg">
            봉인된 기억들이 부활을 기다립니다
          </p>
        </div>

        {/* Tombstone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {tombstones.map((tomb, index) => (
            <div
              key={tomb.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TombstoneCard
                {...tomb}
                onOpen={() => handleOpen(tomb.id)}
              />
            </div>
          ))}
        </div>

        {/* Create New Button */}
        <div className="text-center">
          <Link href="/create">
            <Button variant="seal" size="lg" className="animate-pulse">
              + 새로운 기억 묻기
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--soul-blue)] mb-2">
              {tombstones.length}
            </div>
            <div className="text-stone-500 text-sm">총 기억</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--seal-gold)] mb-2">
              {tombstones.filter((t) => t.locked).length}
            </div>
            <div className="text-stone-500 text-sm">봉인됨</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {tombstones.filter((t) => !t.locked).length}
            </div>
            <div className="text-stone-500 text-sm">부활 가능</div>
          </div>
        </div>
      </div>
    </main>
  );
}
