import axios from 'axios'
import toast from 'react-hot-toast'

// This makes sure the base URL always ends with /api
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api`

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 
           "http://localhost:8000",
  headers: { "Content-Type": "application/json" }
})

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401 and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        // Update the original request header
        originalRequest.headers.Authorization = `Bearer ${access}`

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear auth storage and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        toast.error('Session expired. Please log in again.')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    if (error.response) {
      const { status, data } = error.response
      if (status === 400) {
        toast.error(data?.detail || 'Invalid request')
      } else if (status === 403) {
        toast.error('Permission denied')
      } else if (status === 404) {
        toast.error('Resource not found')
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.')
      } else {
        toast.error(data?.detail || 'An error occurred')
      }
    } else if (error.request) {
      toast.error('No response from server. Please check your connection.')
    } else {
      toast.error('Request configuration error')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
