"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-900/80 backdrop-blur-md border-b border-stone-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={isAuthenticated ? "/graveyard" : "/"} className="flex items-center gap-2">
          <span className="font-cinzel text-2xl text-stone-200 tracking-wider">
            TIMEGRAVE
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                href="/graveyard"
                className="text-stone-400 hover:text-stone-200 transition-colors text-sm"
              >
                내 묘지
              </Link>
              <Link
                href="/create"
                className="text-stone-400 hover:text-stone-200 transition-colors text-sm"
              >
                새로 묻기
              </Link>
              <Link
                href="/settings/notifications"
                className="text-stone-400 hover:text-stone-200 transition-colors text-sm"
              >
                설정
              </Link>
              
              {/* Notification Bell */}
              <NotificationBell />

              {/* User Info & Sign Out */}
              {user && (
                <span className="text-stone-400 text-sm">
                  {user.username}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="text-stone-400 hover:text-stone-200 transition-colors text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-stone-400 hover:text-stone-200 transition-colors text-sm"
              >
                Login
              </Link>
              <Link href="/signup">
                <Button variant="seal" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
