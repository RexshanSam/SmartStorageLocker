import axiosInstance from './axiosInstance'

export const authAPI = {
  register: (userData) => {
    return axiosInstance.post('api/auth/register/', userData)
  },

  login: (credentials) => {
    return axiosInstance.post('api/auth/login/', credentials)
  },

  refresh: (refreshToken) => {
    return axiosInstance.post('api/auth/refresh/', { refresh: refreshToken })
  },

  getMe: () => {
    return axiosInstance.get('api/auth/me/')
  },
}
