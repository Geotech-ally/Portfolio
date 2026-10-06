import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Draws the hairline "schematic rule" above the section. Use for major, sequential sections only — not on every block. */
  divider?: boolean;
  surface?: "default" | "indigo";
}

export function Section({ children, className, id, divider = false, surface = "default" }: SectionProps) {
  return (
    <section id={id} className={cn("pt-24 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28", surface === "indigo" && "projects-section", divider && "schematic-rule")}>
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
      {eyebrow ? <p className="text-meta eyebrow-mark mb-3 text-foreground-faint">{eyebrow}</p> : null}
      <h2 className="section-heading text-heading-lg text-foreground">{title}</h2>
      {description ? <p className="text-body mt-3 text-foreground-muted">{description}</p> : null}
    </div>
  );
}
