import type { ComponentProps } from "react";
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon, Mail } from "lucide-react";

export interface SocialLink {
  label: string;
  href: string;
  Icon: ComponentProps<"svg">["children"] | typeof Mail;
  ariaLabel: string;
}

export const SOCIAL_PROFILES: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/geoffreyakoo",
    Icon: FacebookIcon,
    ariaLabel: "Visit Geoffrey Akoo on Facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/akoo_254/",
    Icon: InstagramIcon,
    ariaLabel: "Visit @akoo_254 on Instagram",
  },
  {
    label: "Twitter / X",
    href: "",
    Icon: TwitterIcon,
    ariaLabel: "Visit Geoffrey Akoo on Twitter / X",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/geoffreyakoo254/",
    Icon: LinkedinIcon,
    ariaLabel: "Visit Geoffrey Akoo on LinkedIn",
  },
  {
    label: "GitHub",
    href: "https://github.com/Geotech-ally",
    Icon: GithubIcon,
    ariaLabel: "Visit Geoffrey Akoo on GitHub",
  },
];

/**
 * Placeholder for Twitter/X profile URL.
 *
 * To enable the Twitter/X link, replace this value with the actual profile URL,
 * for example: "https://x.com/GeoffreyAkoo" or "https://twitter.com/GeoffreyAkoo"
 */
export const SOCIAL_PROFILES_TWITTER_URL = "";
