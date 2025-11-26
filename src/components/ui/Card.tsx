import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = "", glow = false }: CardProps) {
  return (
    <div
      className={`
        bg-card text-card-foreground rounded-lg p-6
        border border-border/10
        transition-all duration-300
        ${glow ? "glow-soul" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
