"use client";

import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";

export default function NotificationSettingsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      <SoulParticles />
      <FogEffect />
      <Header />

      <div className="relative z-20 container mx-auto px-4 py-16 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Go Back
              </Button>
            </Link>

            <h1 className="font-cinzel text-4xl text-stone-200 mb-2">
              Notification Settings
            </h1>
            <p className="text-stone-400">
              Configure notification types and delivery methods
            </p>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-stone-900/60 border-2 border-stone-700 rounded-lg p-12 backdrop-blur-md text-center">
            <div className="flex justify-center mb-6">
              <Bell size={64} className="text-stone-600" />
            </div>
            <h2 className="font-cinzel text-3xl text-stone-300 mb-4">
              Coming Soon
            </h2>
            <p className="text-stone-400 text-lg mb-6">
              Notification settings will be available in a future update.
            </p>
            <p className="text-stone-500 text-sm">
              We&apos;re working on bringing you customizable notifications for
              time capsule events, collaborator activities, and reminders.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
