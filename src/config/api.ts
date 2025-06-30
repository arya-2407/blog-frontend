// API Configuration
export const API_BASE_URL = 'https://week-13-offline.aryapofficial.workers.dev';

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  SIGNUP: `${API_BASE_URL}/api/v1/user/signup`,
  SIGNIN: `${API_BASE_URL}/api/v1/user/signin`,
  USER_INFO: (userId: string) => `${API_BASE_URL}/api/v1/user/${userId}`,
  
  // Blog endpoints
  BLOGS_BULK: `${API_BASE_URL}/api/v1/blog/bulk`,
  BLOG_BY_ID: (id: string) => `${API_BASE_URL}/api/v1/blog/${id}`,
  BLOGS_BY_USER: (userId: string) => `${API_BASE_URL}/api/v1/blog/user/${userId}`,
  CREATE_BLOG: `${API_BASE_URL}/api/v1/blog/`,
  UPDATE_BLOG: (id: string) => `${API_BASE_URL}/api/v1/blog/${id}`,
}; 