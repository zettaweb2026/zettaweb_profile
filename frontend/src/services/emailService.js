/**
 * services/emailService.js — Contact form email submission.
 * Centralizes the email send logic so Contact.jsx and any other
 * forms don't have raw fetch calls with hardcoded URLs.
 */
import { apiPost } from './api';

/**
 * Send a contact form message.
 * @param {{ name: string, email: string, phone?: string, message: string }} payload
 */
export const sendContactEmail = (payload) =>
  apiPost('/send-email', { type: 'contact', ...payload });

/**
 * Send a booking request email.
 * @param {object} payload
 */
export const sendBookingEmail = (payload) =>
  apiPost('/send-email', { type: 'booking', ...payload });
