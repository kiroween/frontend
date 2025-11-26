"use client";

import Link from "next/link";
import { NotificationBell } from "@/components/notifications";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-900/80 backdrop-blur-md border-b border-stone-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/graveyard" className="flex items-center gap-2">
          <span className="font-cinzel text-2xl text-stone-200 tracking-wider">
            TIMEGRAVE
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
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
        </nav>
      </div>
    </header>
  );
}
