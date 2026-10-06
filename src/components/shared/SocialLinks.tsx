import { type ComponentProps } from "react";
import { Mail } from "lucide-react";
import { SOCIAL_PROFILES } from "./SocialProfiles";
import { cn } from "@/lib/utils";

export interface SocialLinkProps {
  link: {
    label: string;
    href: string;
    Icon: ComponentProps<"svg">["children"] | typeof Mail;
    ariaLabel: string;
  };
  className?: string;
}

export function SocialLink({ link, className }: SocialLinkProps) {
  const { label, href, Icon, ariaLabel } = link;

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors duration-150 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {typeof Icon === "function" && Icon !== Mail ? <Icon width={18} height={18} /> : <Mail size={18} />}
    </a>
  );
}

export { SOCIAL_PROFILES };
