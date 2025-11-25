"use client";

export default function SoulParticles() {
  return (
    <div className="absolute inset-0 soul-particles">
      <style jsx>{`
        .soul-particles {
          background-image: radial-gradient(
              2px 2px at 20% 30%,
              var(--soul-blue),
              transparent
            ),
            radial-gradient(2px 2px at 60% 70%, var(--soul-blue), transparent),
            radial-gradient(1px 1px at 50% 50%, var(--soul-blue), transparent),
            radial-gradient(1px 1px at 80% 10%, var(--soul-blue), transparent),
            radial-gradient(2px 2px at 90% 60%, var(--soul-blue), transparent),
            radial-gradient(1px 1px at 33% 80%, var(--soul-blue), transparent),
            radial-gradient(1px 1px at 15% 90%, var(--soul-blue), transparent);
          background-size: 200% 200%;
          background-position: 0% 0%;
          animation: float 20s ease-in-out infinite;
          opacity: 0.6;
        }

        @keyframes float {
          0%,
          100% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  );
}
