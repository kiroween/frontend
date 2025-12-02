import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--deep-void)] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <div className="text-8xl mb-4">🪦</div>
        <h1 className="font-cinzel text-5xl text-stone-300">404</h1>
        <h2 className="font-cinzel text-2xl text-stone-400">
          Lost your way?
        </h2>
        <p className="text-stone-500">
          This page is a memory not yet buried or already vanished.
        </p>
        <Link href="/">
          <Button variant="seal" size="lg">
            Return to Graveyard
          </Button>
        </Link>
      </div>
    </div>
  );
}
