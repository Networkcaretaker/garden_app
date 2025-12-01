import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
  token?: string;
}

export const api = {
  // Helper to make authenticated requests
  request: async (endpoint: string, options: FetchOptions = {}) => {
    let token = options.token;

    // If no token provided, try to get the current user's token
    if (!token && auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }

    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Ensure we send JSON by default unless specified otherwise (e.g. for FormData)
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  },

  // HTTP Wrapper methods
  get: (endpoint: string) => api.request(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, data: unknown) => 
    api.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),

  put: (endpoint: string, data: unknown) => 
    api.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    
  delete: (endpoint: string) => api.request(endpoint, { method: 'DELETE' }),
};