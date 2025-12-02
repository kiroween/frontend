"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User, Lock, Trash2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, deleteAccount, isAuthenticated, isLoading } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state during hydration
  if (!isMounted || isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
        <SoulParticles />
        <FogEffect />
        <Header />
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">⚙️</div>
            <p className="text-stone-400">Loading settings...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your time capsules will be permanently deleted."
    );

    if (!confirmed) return;

    const doubleConfirm = confirm(
      "This is your last chance. Type 'DELETE' to confirm account deletion."
    );

    if (!doubleConfirm) return;

    try {
      setIsDeleting(true);
      await deleteAccount();
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      <SoulParticles />
      <FogEffect />
      <Header />

      <div className="relative z-20 container mx-auto px-4 py-16 pt-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <Link href="/graveyard">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
          </Link>

          <h1 className="font-cinzel text-4xl text-stone-200 mb-2">Settings</h1>
          <p className="text-stone-400">Manage your account and preferences</p>
        </div>

        {/* Settings Grid */}
        <div className="max-w-4xl mx-auto grid gap-6">
          {/* Profile Section */}
          <div className="bg-stone-900/60 border-2 border-stone-700 rounded-lg p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <User size={24} className="text-[var(--soul-blue)]" />
              <h2 className="font-cinzel text-2xl text-stone-200">Profile</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-stone-400 text-sm mb-1">
                  Username
                </label>
                {user?.username ? (
                  <p className="text-stone-200 text-lg">{user.username}</p>
                ) : (
                  <p className="text-stone-500 text-lg italic">Loading...</p>
                )}
              </div>
              <div>
                <label className="block text-stone-400 text-sm mb-1">
                  Email
                </label>
                {user?.email ? (
                  <p className="text-stone-200 text-lg">{user.email}</p>
                ) : (
                  <p className="text-stone-500 text-lg italic">Loading...</p>
                )}
              </div>
              {user?.createdAt && (
                <div>
                  <label className="block text-stone-400 text-sm mb-1">
                    Member Since
                  </label>
                  <p className="text-stone-200">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
              <p className="text-stone-500 text-sm italic">
                * Profile editing will be available in a future update
              </p>
            </div>
          </div>

          {/* Notifications Section */}
          <Link href="/settings/notifications">
            <div className="bg-stone-900/60 border-2 border-stone-700 rounded-lg p-6 backdrop-blur-md hover:border-[var(--soul-blue)] transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={24} className="text-[var(--soul-blue)]" />
                  <div>
                    <h2 className="font-cinzel text-2xl text-stone-200">
                      Notifications
                    </h2>
                    <p className="text-stone-400 text-sm">
                      Configure notification preferences
                    </p>
                  </div>
                </div>
                <div className="text-stone-400">→</div>
              </div>
            </div>
          </Link>

          {/* Security Section */}
          <div className="bg-stone-900/60 border-2 border-stone-700 rounded-lg p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={24} className="text-[var(--soul-blue)]" />
              <h2 className="font-cinzel text-2xl text-stone-200">Security</h2>
            </div>

            <div className="space-y-4">
              <p className="text-stone-400 text-sm">
                Change your password and manage security settings
              </p>
              <Button variant="ghost" disabled className="w-full">
                Change Password (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-900/10 border-2 border-red-700/50 rounded-lg p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 size={24} className="text-red-400" />
              <h2 className="font-cinzel text-2xl text-red-400">Danger Zone</h2>
            </div>

            <div className="space-y-4">
              <p className="text-stone-400 text-sm">
                Once you delete your account, there is no going back. All your
                time capsules will be permanently deleted.
              </p>
              <Button
                variant="ghost"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
