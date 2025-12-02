"use client";

import { useState, useEffect } from "react";
import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import { TombstoneCard } from "@/components/graveyard/TombstoneCard";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { TimeCapsule } from "@/lib/types/timecapsule";
import { gravesApi } from "@/lib/api/graves";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

/**
 * Calculate days remaining until unlock date
 */
function calculateDaysRemaining(openDate: Date): number {
  const now = new Date();
  const diff = openDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function GraveyardPage() {
  const [tombstones, setTombstones] = useState<TimeCapsule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch time capsules on mount
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchTombstones = async () => {
      try {
        setIsLoading(true);
        const response = await gravesApi.getAll();
        setTombstones(response.data);
      } catch (error: any) {
        console.error('Failed to fetch tombstones:', error);
        showToast(error.message || 'Time Capsule 목록을 불러오는데 실패했습니다', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTombstones();
  }, [isAuthenticated, router, showToast]);

  const handleOpen = (id: string) => {
    router.push(`/view/${id}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
        <SoulParticles />
        <FogEffect />
        <Header />
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      <SoulParticles />
      <FogEffect />
      <Header />

      <div className="relative z-20 container mx-auto px-4 py-16 pt-24">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="font-cinzel text-5xl md:text-6xl text-stone-300 mb-4 tracking-wider">
            나의 묘지
          </h1>
          <p className="text-stone-500 text-lg">
            Sealed Memory들이 부활을 기다립니다
          </p>
        </div>

        {/* Tombstone Grid */}
        {tombstones.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 opacity-50">🪦</div>
            <p className="text-stone-400 text-lg mb-8">
              아직 묻힌 기억이 없습니다
            </p>
            <Link href="/create">
              <Button variant="seal" size="lg">
                첫 기억 묻기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {tombstones.map((tomb, index) => {
              // Calculate days remaining for locked capsules
              const daysRemaining = tomb.status === 'locked' 
                ? calculateDaysRemaining(tomb.openDate) 
                : undefined;
              
              return (
                <div
                  key={tomb.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TombstoneCard
                    timeCapsule={tomb}
                    daysRemaining={daysRemaining}
                    onOpen={() => handleOpen(tomb.id)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Create New Button */}
        {tombstones.length > 0 && (
          <div className="text-center">
            <Link href="/create">
              <Button variant="seal" size="lg" className="animate-pulse">
                + 새로운 기억 묻기
              </Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        {tombstones.length > 0 && (
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--soul-blue)] mb-2">
                {tombstones.length}
              </div>
              <div className="text-stone-500 text-sm">총 기억</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--seal-gold)] mb-2">
                {tombstones.filter((t) => t.status === 'locked').length}
              </div>
              <div className="text-stone-500 text-sm">봉인됨</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {tombstones.filter((t) => t.status === 'unlocked').length}
              </div>
              <div className="text-stone-500 text-sm">부활 가능</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
