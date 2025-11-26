"use client";

import { useEffect, useState, useCallback } from "react";

export default function FogEffect() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    });
  }, []);

  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout;
    const throttledMouseMove = (e: MouseEvent) => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          handleMouseMove(e);
          throttleTimeout = null as any;
        }, 50);
      }
    };

    window.addEventListener("mousemove", throttledMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [handleMouseMove]);

  return (
    <div
      className="absolute inset-0 pointer-events-none transition-all duration-300 will-change-opacity"
      style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, transparent 0%, var(--fog-gray) 50%)`,
        opacity: 0.3,
      }}
      aria-hidden="true"
    />
  );
}
