"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseVx: number;
  baseVy: number;
}

interface MousePosition {
  x: number;
  y: number;
}

// Repulsion physics constants
const REPULSION_RADIUS = 150;
const REPULSION_STRENGTH = 0.5;
const RETURN_SPEED = 0.05;

export default function SoulParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<MousePosition>({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const particles: Particle[] = [];
    // Optimize particle count for mobile devices
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile 
      ? Math.min(30, Math.floor(window.innerWidth / 25))
      : Math.min(50, Math.floor(window.innerWidth / 20));

    // 파티클 생성
    for (let i = 0; i < particleCount; i++) {
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx,
        vy,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        baseVx: vx,
        baseVy: vy,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // 마우스와의 거리 계산
        const dx = particle.x - mousePosRef.current.x;
        const dy = particle.y - mousePosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 마우스가 가까우면 밀어내기, 멀면 원래 속도로 복귀
        if (distance < REPULSION_RADIUS && distance > 0) {
          // 정규화된 방향 벡터
          const nx = dx / distance;
          const ny = dy / distance;

          // 거리에 반비례하는 힘 (가까울수록 강함)
          const force = (1 - distance / REPULSION_RADIUS) * REPULSION_STRENGTH;

          // 속도에 힘 적용
          particle.vx += nx * force;
          particle.vy += ny * force;
        } else {
          // 원래 속도로 부드럽게 복귀
          particle.vx += (particle.baseVx - particle.vx) * RETURN_SPEED;
          particle.vy += (particle.baseVy - particle.vy) * RETURN_SPEED;
        }

        // 파티클 이동
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 화면 밖으로 나가면 반대편에서 나타남
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // 파티클 그리기 (shadow 최적화)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 144, 226, ${particle.opacity})`;
        // Shadow는 성능 비용이 높으므로 조건부 적용
        if (particle.size > 1.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#4a90e2";
        }
        ctx.fill();
        // Shadow 리셋으로 다음 파티클에 영향 방지
        if (particle.size > 1.5) {
          ctx.shadowBlur = 0;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 250);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none will-change-transform"
      aria-hidden="true"
    />
  );
}
