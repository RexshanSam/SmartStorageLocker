import axiosInstance from './axiosInstance'

export const lockerAPI = {
  getAll: (params = {}) => {
    return axiosInstance.get('/lockers/', { params })
  },

  getById: (id) => {
    return axiosInstance.get(`/lockers/${id}/`)
  },

  create: (lockerData) => {
    return axiosInstance.post('/lockers/', lockerData)
  },

  update: (id, lockerData) => {
    return axiosInstance.put(`/lockers/${id}/`, lockerData)
  },

  delete: (id) => {
    return axiosInstance.delete(`/lockers/${id}/`)
  },
}
