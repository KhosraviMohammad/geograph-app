// API URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/'

// Auth URLs
export const authUrls = {
  login: () => `${API_BASE_URL}auth/login/`,
  logout: () => `${API_BASE_URL}auth/logout/`,
  register: () => `${API_BASE_URL}auth/register/`,
  refresh: () => `${API_BASE_URL}auth/refresh/`,
  profile: () => `${API_BASE_URL}auth/profile/`,
}

// Data URLs
export const dataUrls = {
  layers: () => `${API_BASE_URL}layers/`,
  import: () => `${API_BASE_URL}import/`,
  export: () => `${API_BASE_URL}export/`,
}
