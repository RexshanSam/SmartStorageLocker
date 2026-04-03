import { useState, useEffect, useCallback } from 'react'
import { lockerAPI } from '../api/lockerAPI'
import toast from 'react-hot-toast'

export const useLockers = () => {
  const [lockers, setLockers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLockers = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await lockerAPI.getAll(params)
      setLockers(response.data.results || response.data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load lockers')
    } finally {
      setLoading(false)
    }
  }, [])

  const createLocker = async (lockerData) => {
    const response = await lockerAPI.create(lockerData)
    toast.success('Locker created successfully')
    return response.data
  }

  const updateLocker = async (id, lockerData) => {
    const response = await lockerAPI.update(id, lockerData)
    toast.success('Locker updated successfully')
    return response.data
  }

  const deleteLocker = async (id) => {
    await lockerAPI.delete(id)
    toast.success('Locker deleted successfully')
  }

  return {
    lockers,
    loading,
    error,
    fetchLockers,
    createLocker,
    updateLocker,
    deleteLocker,
  }
}
