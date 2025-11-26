/**
 * Performance monitoring utilities for TimeGrave
 */

export class FPSMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private readonly maxSamples = 60;

  update(): number {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    const fps = 1000 / delta;
    this.frames.push(fps);

    if (this.frames.length > this.maxSamples) {
      this.frames.shift();
    }

    return fps;
  }

  getAverageFPS(): number {
    if (this.frames.length === 0) return 0;
    const sum = this.frames.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.frames.length);
  }

  getMinFPS(): number {
    if (this.frames.length === 0) return 0;
    return Math.round(Math.min(...this.frames));
  }

  reset(): void {
    this.frames = [];
    this.lastTime = performance.now();
  }
}

/**
 * Log performance metrics to console (development only)
 */
export function logPerformanceMetrics(componentName: string, fps: number): void {
  if (process.env.NODE_ENV === 'development') {
    if (fps < 50) {
      console.warn(`⚠️ ${componentName}: Low FPS detected (${fps.toFixed(1)})`);
    }
  }
}
