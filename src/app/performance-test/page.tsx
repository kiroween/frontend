"use client";

import { useEffect, useState } from "react";
import SoulParticles from "@/components/animations/SoulParticles";
import { Button } from "@/components/ui/Button";

export default function PerformanceTestPage() {
  const [fps, setFps] = useState<number>(0);
  const [avgFps, setAvgFps] = useState<number>(0);
  const [minFps, setMinFps] = useState<number>(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!isMonitoring) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let fpsValues: number[] = [];
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        setFps(currentFps);
        fpsValues.push(currentFps);

        // Keep only last 10 seconds of data
        if (fpsValues.length > 10) {
          fpsValues.shift();
        }

        const avg = Math.round(
          fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length
        );
        const min = Math.min(...fpsValues);

        setAvgFps(avg);
        setMinFps(min);

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isMonitoring]);

  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (isMonitoring) {
      setFps(0);
      setAvgFps(0);
      setMinFps(0);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      <SoulParticles />

      <div className="relative z-20 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-cinzel text-4xl text-stone-300 mb-8">
            Performance Test
          </h1>

          <div className="bg-stone-900/80 backdrop-blur-md rounded-lg p-6 mb-6 border border-stone-700">
            <h2 className="text-xl text-stone-300 mb-4">FPS Monitor</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-soul-blue mb-1">
                  {fps}
                </div>
                <div className="text-sm text-stone-400">Current FPS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-stone-300 mb-1">
                  {avgFps}
                </div>
                <div className="text-sm text-stone-400">Average FPS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-stone-300 mb-1">
                  {minFps || "-"}
                </div>
                <div className="text-sm text-stone-400">Minimum FPS</div>
              </div>
            </div>

            <Button
              onClick={handleToggleMonitoring}
              variant={isMonitoring ? "ghost" : "seal"}
              className="w-full"
            >
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>

            {avgFps > 0 && (
              <div className="mt-4 p-4 rounded bg-stone-800/50">
                <div className="text-sm text-stone-300">
                  {avgFps >= 55 ? (
                    <span className="text-green-400">
                      ✓ Performance is excellent (≥55 FPS)
                    </span>
                  ) : avgFps >= 45 ? (
                    <span className="text-yellow-400">
                      ⚠ Performance is acceptable (45-54 FPS)
                    </span>
                  ) : (
                    <span className="text-red-400">
                      ✗ Performance needs improvement (&lt;45 FPS)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-stone-900/80 backdrop-blur-md rounded-lg p-6 border border-stone-700">
            <h2 className="text-xl text-stone-300 mb-4">Test Instructions</h2>
            <ol className="space-y-2 text-stone-400 text-sm list-decimal list-inside">
              <li>Click "Start Monitoring" to begin FPS measurement</li>
              <li>Move your mouse around the screen</li>
              <li>Observe how particles react to your cursor</li>
              <li>Check that FPS stays above 55 on desktop</li>
              <li>On mobile, test with touch gestures</li>
              <li>Verify particles smoothly return to normal movement</li>
            </ol>
          </div>

          <div className="mt-6 bg-stone-900/80 backdrop-blur-md rounded-lg p-6 border border-stone-700">
            <h2 className="text-xl text-stone-300 mb-4">
              Optimization Features
            </h2>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li>✓ Conditional shadow rendering (particles &gt; 1.5px)</li>
              <li>✓ Mobile-optimized particle count (30 vs 50)</li>
              <li>✓ Passive event listeners</li>
              <li>✓ Debounced resize handler (250ms)</li>
              <li>✓ RequestAnimationFrame for smooth animation</li>
              <li>✓ GPU-accelerated rendering (will-change)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
