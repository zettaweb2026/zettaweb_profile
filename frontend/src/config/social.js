/**
 * social.js — All social media profile links in one place.
 * Import { SOCIAL_LINKS } everywhere instead of duplicating links.
 */
import { Linkedin, Facebook, Instagram, Github } from 'lucide-react';

export const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/zettawebsolutions/',
    icon: Linkedin,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61590293921402',
    icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/zetta_web_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    icon: Instagram,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/zettaweb2026',
    icon: Github,
  },
];
