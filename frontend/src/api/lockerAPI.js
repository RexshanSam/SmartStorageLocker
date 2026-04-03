import axiosInstance from './axiosInstance'

export const lockerAPI = {
  getAll: (params = {}) => {
    return axiosInstance.get('/api/lockers/', { params })
  },
  getById: (id) => {
    return axiosInstance.get(`/api/lockers/${id}/`)
  },

  create: (lockerData) => {
    return axiosInstance.post('api/lockers/', lockerData)
  },

  update: (id, lockerData) => {
    return axiosInstance.put(`api/lockers/${id}/`, lockerData)
  },

  delete: (id) => {
    return axiosInstance.delete(`api/lockers/${id}/`)
  },
}
