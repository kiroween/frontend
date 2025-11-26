export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--deep-void)]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-stone-700 border-t-[var(--soul-blue)] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl animate-pulse">💀</div>
        </div>
      </div>
    </div>
  );
}
