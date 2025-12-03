"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      // 먼저 홈으로 이동합니다.
      router.push("/");

      // 페이지 이동이 처리될 시간을 확보하기 위해 약간의 지연 후 로그아웃을 수행합니다.
      // 이렇게 하면 현재 페이지(Graveyard 등)가 인증 해제 상태를 감지하고
      // 로그인 페이지로 리다이렉트하는 것을 방지할 수 있습니다.
      setTimeout(async () => {
        await signOut();
      }, 100);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-900/80 backdrop-blur-md border-b border-stone-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={isAuthenticated ? "/graveyard" : "/"}
          className="flex items-center gap-2"
        >
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
                My Graveyard
              </Link>
              <Link
                href="/create"
                className="text-stone-400 hover:text-stone-200 transition-colors text-sm"
              >
                Create New
              </Link>
              <Link
                href="/settings"
                className="text-stone-400 hover:text-stone-200 transition-colors text-sm"
              >
                Settings
              </Link>

              {/* User Info & Sign Out */}
              {user && (
                <span className="text-stone-400 text-sm">{user.username}</span>
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
