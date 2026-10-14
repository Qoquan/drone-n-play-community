// Backend API URL - uses environment variable or fallback to production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://drone-n-play-backend.onrender.com/api';

/**
 * User Service
 * Handles all user-related API calls
 */

/**
 * Get user profile with statistics
 */
export const getUserProfile = async (userId: number, token: string) => {
  const response = await fetch(`${API_URL}/users/${userId}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch profile');
  }

  return response.json();
};

/**
 * Get user statistics
 */
export const getUserStats = async (userId: number, token: string) => {
  const response = await fetch(`${API_URL}/users/${userId}/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch stats');
  }

  return response.json();
};

/**
 * Update user profile (name, bio)
 */
export const updateProfile = async (
  userId: number,
  token: string,
  data: { name?: string; bio?: string }
) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update profile');
  }

  return response.json();
};

/**
 * Update user avatar
 */
export const updateAvatar = async (
  userId: number,
  token: string,
  avatarUrl: string
) => {
  const response = await fetch(`${API_URL}/users/${userId}/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ avatarUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update avatar');
  }

  return response.json();
};

/**
 * Change user password
 */
export const changePassword = async (
  userId: number,
  token: string,
  currentPassword: string,
  newPassword: string
) => {
  const response = await fetch(`${API_URL}/users/${userId}/password`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to change password');
  }

  return response.json();
};