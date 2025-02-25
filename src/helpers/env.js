const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://q-motion.questbook.io'

export const API_CONFIG = {
  BASE_URL,
  API_URL: `${BASE_URL}/api`,
}
export const ENV = {
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  IS_PROD: import.meta.env.NODE_ENV === 'production',
  IS_DEV: import.meta.env.NODE_ENV === 'development',
}

export const API_ROUTES = {
  PROJECTS: {
    LIST: '/project',
    DETAIL: (id) => `/project/${id}`,
  }
}
