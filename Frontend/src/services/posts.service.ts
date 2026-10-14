// Backend API URL - uses environment variable or fallback to production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://drone-n-play-backend.onrender.com/api';

/**
 * Posts Service (API Client)
 * Handles all post-related API calls
 * PHASE-3.1: Posts CRUD
 */

/**
 * Create a new post
 */
export const createPost = async (
  token: string,
  content: string,
  image?: string
) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, image }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create post');
  }

  return response.json();
};

/**
 * Get posts feed
 */
export const getPosts = async (
  token: string,
  limit: number = 10,
  offset: number = 0
) => {
  const response = await fetch(
    `${API_URL}/posts?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch posts');
  }

  return response.json();
};

/**
 * Get single post by ID
 */
export const getPost = async (token: string, postId: number) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch post');
  }

  return response.json();
};

/**
 * Get posts by user ID
 */
export const getUserPosts = async (
  token: string,
  userId: number,
  limit: number = 10,
  offset: number = 0
) => {
  const response = await fetch(
    `${API_URL}/posts/user/${userId}?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user posts');
  }

  return response.json();
};

/**
 * Update post
 */
export const updatePost = async (
  token: string,
  postId: number,
  data: { content?: string; image?: string }
) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update post');
  }

  return response.json();
};

/**
 * Delete post
 */
export const deletePost = async (token: string, postId: number) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete post');
  }

  return response.json();
};