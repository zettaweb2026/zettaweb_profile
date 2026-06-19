/**
 * services/api.js — Base fetch wrapper.
 * All API calls should go through this to ensure consistent auth headers,
 * error handling, and a single point of config for the API base URL.
 */
import { getAuthHeaders, parseApiResponse } from '../lib/auth';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';

/**
 * Core fetch wrapper that attaches auth headers and parses responses.
 * @param {string} endpoint - e.g. '/projects'
 * @param {RequestInit} options - fetch options
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  return parseApiResponse(response);
};

/**
 * Convenience helpers
 */
export const apiGet = (endpoint) => apiFetch(endpoint, { method: 'GET' });

export const apiPost = (endpoint, body) =>
  apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiPut = (endpoint, body) =>
  apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiDelete = (endpoint) =>
  apiFetch(endpoint, { method: 'DELETE' });
