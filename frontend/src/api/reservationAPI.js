import axiosInstance from './axiosInstance'

export const reservationAPI = {
  getAll: () => {
    return axiosInstance.get('api/reservations/')
  },

  getById: (id) => {
    return axiosInstance.get(`api/reservations/${id}/`)
  },

  create: (reservationData) => {
    return axiosInstance.post('api/reservations/', reservationData)
  },

  release: (id, reason = '') => {
    return axiosInstance.put(`api/reservations/${id}/release/`, { reason })
  },
}
