import axiosInstance from './axiosInstance'

export const reservationAPI = {
  getAll: () => {
    return axiosInstance.get('/reservations/')
  },

  getById: (id) => {
    return axiosInstance.get(`/reservations/${id}/`)
  },

  create: (reservationData) => {
    return axiosInstance.post('/reservations/', reservationData)
  },

  release: (id, reason = '') => {
    return axiosInstance.put(`/reservations/${id}/release/`, { reason })
  },
}
