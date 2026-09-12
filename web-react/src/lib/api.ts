/**
 * API Client for PROOF backend
 * Base URL configured via environment variable
 */

// In development, use Vite's proxy (/api -> http://localhost:3001/api)
// In production, use the VITE_API_URL environment variable or same-origin
const API_BASE = import.meta.env.DEV 
  ? '' // Use Vite proxy in development
  : (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Include cookies for session
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, config);
    
    const text = await response.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { error: { message: text || response.statusText } };
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.error?.code || data?.code || 'UNKNOWN_ERROR',
        data?.error?.message || data?.message || 'An error occurred',
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or parsing error
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      error instanceof Error ? error.message : 'Network request failed'
    );
  }
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'POST', body, headers }),

  patch: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PATCH', body, headers }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'DELETE', headers }),

  put: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PUT', body, headers }),
};

export { API_BASE };
