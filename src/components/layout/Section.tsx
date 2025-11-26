import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
}

export function Section({ children, className = "", centered = false }: SectionProps) {
  return (
    <section
      className={`w-full px-4 py-8 md:px-8 md:py-12 ${
        centered ? "flex items-center justify-center" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}
