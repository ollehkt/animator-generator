import axios from 'axios'
import { API_CONFIG } from './apiRoutes'

const api = axios.create({
  baseURL: API_CONFIG.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Content-Language': document.documentElement.lang,
  },
})

// Optional: Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add any request preprocessing here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Optional: Add response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    return Promise.reject(error)
  }
)

export { api }
