import { useEffect, useRef } from 'react';

interface PerformanceStats {
  fps: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export function usePerformanceMonitor(enabled: boolean = false) {
  const statsRef = useRef<PerformanceStats>({ fps: 0 });
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    const updateStats = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        statsRef.current.fps = fps;

        // Memory stats (if available)
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          statsRef.current.memory = {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
          };
        }

        // Log stats to console
        console.log('Performance Stats:', {
          FPS: fps,
          Memory: statsRef.current.memory ? {
            Used: `${Math.round(statsRef.current.memory.usedJSHeapSize / 1024 / 1024)}MB`,
            Total: `${Math.round(statsRef.current.memory.totalJSHeapSize / 1024 / 1024)}MB`,
            Limit: `${Math.round(statsRef.current.memory.jsHeapSizeLimit / 1024 / 1024)}MB`,
          } : 'Not available'
        });

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      requestAnimationFrame(updateStats);
    };

    const animationId = requestAnimationFrame(updateStats);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  return statsRef.current;
} 