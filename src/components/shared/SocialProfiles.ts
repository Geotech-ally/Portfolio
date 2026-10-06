import type { ComponentType, SVGProps } from "react";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/shared/BrandIcons";

export interface SocialLink {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  ariaLabel: string;
}

export const SOCIAL_PROFILES: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100092996245901",
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
    Icon: XIcon,
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
