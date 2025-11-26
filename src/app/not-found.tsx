import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--deep-void)] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <div className="text-8xl mb-4">🪦</div>
        <h1 className="font-cinzel text-5xl text-stone-300">404</h1>
        <h2 className="font-cinzel text-2xl text-stone-400">
          길을 잃으셨나요?
        </h2>
        <p className="text-stone-500">
          이 페이지는 아직 묻히지 않았거나 이미 사라진 기억입니다.
        </p>
        <Link href="/">
          <Button variant="seal" size="lg">
            묘지로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
