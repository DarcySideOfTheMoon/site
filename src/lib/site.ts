// One place to edit your public details.
// Empty strings are hidden automatically, so fill them in as accounts go live.

export const site = {
  name: "Darcy Side of the Moon",
  handle: "darcysideofthemoon",
  url: "https://darcysideofthemoon.com",
  tagline: "Product design, built and explained.",
  description:
    "Senior product designer building AI-native products. Case studies, working prototypes, walkthrough videos, and the reasoning behind every decision.",
  links: {
    github: "https://github.com/darcysideofthemoon",
    bluesky: "", // e.g. https://bsky.app/profile/darcysideofthemoon.bsky.social
    x: "", // e.g. https://x.com/darcysideofthemoon
    linkedin: "", // e.g. https://www.linkedin.com/in/your-name
    email: "", // e.g. hello@yourdomain.com (shown as a mailto: link)
  },
  // Drop your PDF at public/resume.pdf and this link just works.
  resume: "/resume.pdf",
} as const;

export type SocialKey = keyof typeof site.links;

export const socialLabels: Record<SocialKey, string> = {
  github: "GitHub",
  bluesky: "Bluesky",
  x: "X",
  linkedin: "LinkedIn",
  email: "Email",
};

export function socialHref(key: SocialKey): string {
  const value = site.links[key];
  if (!value) return "";
  return key === "email" ? `mailto:${value}` : value;
}
