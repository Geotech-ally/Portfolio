import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Draws the hairline "schematic rule" above the section. Use for major, sequential sections only — not on every block. */
  divider?: boolean;
}

export function Section({ children, className, id, divider = false }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", divider && "schematic-rule")}>
      <Container className={className}>{children}</Container>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 max-w-2xl", className)}>
      {eyebrow ? <p className="text-meta mb-3">{eyebrow}</p> : null}
      <h2 className="text-heading-lg text-foreground">{title}</h2>
      {description ? <p className="text-body mt-3 text-foreground-muted">{description}</p> : null}
    </div>
  );
}
