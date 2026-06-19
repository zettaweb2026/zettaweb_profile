/**
 * services/contentService.js — All content-related API calls.
 * Fetches projects, services, testimonials, and about data from the backend.
 */
import { apiGet } from './api';

export const contentService = {
  /** Fetch all projects */
  getProjects: () => apiGet('/content/projects'),

  /** Fetch all services */
  getServices: () => apiGet('/content/services'),

  /** Fetch all testimonials */
  getTestimonials: () => apiGet('/content/testimonials'),

  /** Fetch about section values */
  getAboutValues: () => apiGet('/content/about'),

  /** Fetch tech stack data */
  getTechStack: () => apiGet('/content/tech-stack'),

  /** Fetch FAQ items */
  getFAQ: () => apiGet('/content/faq'),
};
