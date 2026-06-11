export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'zettaweb_token';
const USER_KEY = 'zettaweb_user';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const saveAuthSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getAuthHeaders = () => {
  const token = getAuthToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

const friendlyFallbackMessages = {
  400: 'Please check the information and try again.',
  401: 'Invalid email or password.',
  403: 'You do not have permission to access this area.',
  404: 'The requested service was not found.',
  409: 'An account with this email already exists.',
  500: 'Something went wrong on the server. Please try again later.',
};

export const getFriendlyErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;

  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (error.isApiError && error.message) {
    return error.message;
  }

  return fallback;
};

export const parseApiResponse = async (response) => {
  let data = null;

  try {
    data = await response.clone().json();
  } catch (jsonError) {
    try {
      const text = await response.clone().text();
      data = text ? { message: text } : null;
    } catch (textError) {
      data = null;
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
      friendlyFallbackMessages[response.status] ||
      'The request could not be completed. Please try again.'
    );
    error.isApiError = true;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data || {};
};
