/**
 * site.js — Single source of truth for all site-wide metadata.
 * Import from here instead of hard-coding values across components.
 */

export const SITE_CONFIG = {
  name: 'Zettaweb',
  fullName: 'Zettaweb Solutions',
  tagline: 'Building the Future, One Solution at a Time',
  description:
    'ZettaWeb is a top software development company providing premium web development, AI solutions, and cloud services for modern businesses.',
  url: 'https://www.zetta-web.in',
  email: 'support@zetta-web.in',
  phone: '+91 9674171451',
  location: {
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    mapsUrl:
      'https://www.google.com/maps/place/Kolkata,+West+Bengal/@22.5355649,88.2649518,12z',
  },
  logo: '/logo.png',
  github: 'https://github.com/zettaweb2026',
};

export const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${SITE_CONFIG.email}`;
