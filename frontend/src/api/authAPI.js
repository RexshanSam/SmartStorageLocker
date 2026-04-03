import axiosInstance from './axiosInstance'

export const authAPI = {
  register: (userData) => {
    return axiosInstance.post('/auth/register/', userData)
  },

  login: (credentials) => {
    return axiosInstance.post('/auth/login/', credentials)
  },

  refresh: (refreshToken) => {
    return axiosInstance.post('/auth/refresh/', { refresh: refreshToken })
  },

  getMe: () => {
    return axiosInstance.get('/auth/me/')
  },
}
