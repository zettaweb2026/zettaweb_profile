/**
 * navigation.js — Centralized navigation item definitions.
 * Used by Navbar, Footer, and any sitemap generation utilities.
 */

export const NAV_ITEMS = [
  { name: 'Home', type: 'hash', href: '#hero', sectionId: 'hero', path: '/' },
  { name: 'Services', type: 'page', href: '/services', path: '/services' },
  { name: 'Projects', type: 'page', href: '/projects', path: '/projects' },
  { name: 'Testimonials', type: 'page', href: '/testimonials', path: '/testimonials' },
  { name: 'Contact', type: 'page', href: '/contact', path: '/contact' },
];

export const FOOTER_LINKS = {
  Company: [
    { name: 'About Us', href: '#about' },
    { name: 'Our Team', href: '#about' },
    { name: 'Careers', href: '#contact' },
    { name: 'Contact', href: '#contact' },
  ],
  Services: [
    { name: 'Web Development', href: '#services' },
    { name: 'App Development', href: '#services' },
    { name: 'AI/ML Solutions', href: '#services' },
    { name: 'Cloud & DevOps', href: '#services' },
  ],
  Resources: [
    { name: 'Portfolio', href: '#projects' },
    { name: 'Tech Stack', href: '#tech-stack' },
    { name: 'Blog', href: '#', badge: 'Coming Soon' },
    { name: 'Documentation', href: '#', badge: 'Coming Soon' },
  ],
};
