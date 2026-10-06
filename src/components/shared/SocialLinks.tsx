import type { ComponentType, SVGProps } from "react";
import { SOCIAL_PROFILES } from "./SocialProfiles";
import { cn } from "@/lib/utils";

export interface SocialLinkProps {
  link: {
    label: string;
    href: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    ariaLabel: string;
  };
  className?: string;
}

export function SocialLink({ link, className }: SocialLinkProps) {
  const { href, Icon, ariaLabel } = link;

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "social-link inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors duration-150 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <Icon width={18} height={18} />
    </a>
  );
}

export { SOCIAL_PROFILES };
