const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('df360_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('df360_token');
    localStorage.removeItem('df360_user');
    window.dispatchEvent(new Event('auth-expired'));
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API request failed');
  }

  return response.json();
}

export const api = {
  get: (path, options) => apiFetch(path, { method: 'GET', ...options }),
  post: (path, data, options) => apiFetch(path, { method: 'POST', body: JSON.stringify(data), ...options }),
  put: (path, data, options) => apiFetch(path, { method: 'PUT', body: JSON.stringify(data), ...options }),
  delete: (path, options) => apiFetch(path, { method: 'DELETE', ...options }),
};
