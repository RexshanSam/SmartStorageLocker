import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { lockerAPI } from '../api/lockerAPI'
import { reservationAPI } from '../api/reservationAPI'
import StatusBadge from '../components/StatusBadge.jsx'
import Modal from '../components/Modal.jsx'
import toast from 'react-hot-toast'

const LockerDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [locker, setLocker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReserveModal, setShowReserveModal] = useState(false)
  const [showConfirmReserve, setShowConfirmReserve] = useState(false)
  const [reserveData, setReserveData] = useState({
    reserved_from: '',
    reserved_until: '',
  })

  useEffect(() => {
    fetchLocker()
  }, [id])

  const fetchLocker = async () => {
    try {
      const response = await lockerAPI.getById(id)
      setLocker(response.data)
      setError(null)
    } catch (error) {
      setError('Locker not found')
      toast.error('Unable to load locker details')
    } finally {
      setLoading(false)
    }
  }

  const handleReserve = async () => {
    try {
      console.log('Sending reservation data:', {
        locker: locker.id,
        reserved_from: reserveData.reserved_from,
        reserved_until: reserveData.reserved_until,
      })
      await reservationAPI.create({
        locker: locker.id,
        reserved_from: reserveData.reserved_from,
        reserved_until: reserveData.reserved_until,
      })
      toast.success('Locker reserved successfully!')
      setShowReserveModal(false)
      setShowConfirmReserve(false)
      fetchLocker()
      navigate('/my-reservations')
    } catch (error) {
      console.error('Reservation error:', error.response?.data)
      let message = 'Failed to reserve locker'
      if (error.response?.data) {
        // DRF returns errors as {field: [errors]} or {detail: "..."}
        if (error.response.data.detail) {
          message = error.response.data.detail
        } else if (error.response.data.locker) {
          message = Array.isArray(error.response.data.locker) ? error.response.data.locker[0] : error.response.data.locker
        } else if (typeof error.response.data === 'object') {
          // Get first error from any field
          const firstError = Object.values(error.response.data)[0]
          if (firstError) {
            message = Array.isArray(firstError) ? firstError[0] : firstError
          }
        }
      }
      toast.error(message)
    }
  }

  const formatDateString = (date) => {
    const d = new Date(date)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
  }

  const getSizeLabel = (size) => {
    switch (size) {
      case 'small':
        return 'Small (Fit for bags)'
      case 'medium':
        return 'Medium (Fit for boxes)'
      case 'large':
        return 'Large (Fit for luggage)'
      default:
        return size
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
      </div>
    )
  }

  if (error || !locker) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Locker Not Found</h2>
        <p className="text-gray-400 mb-6">The locker you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/lockers')}
          className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Browse Lockers
        </button>
      </div>
    )
  }

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }} className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Locker {locker.locker_number}</h1>
                <p className="text-gray-400 text-lg">{locker.location}</p>
              </div>
              <StatusBadge status={locker.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-navy-900 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Size</p>
                <p className="text-white font-medium">{getSizeLabel(locker.size)}</p>
              </div>
              <div className="p-4 bg-navy-900 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className={`font-medium ${locker.status === 'available' ? 'text-green-400' : locker.status === 'reserved' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {locker.status.charAt(0).toUpperCase() + locker.status.slice(1)}
                </p>
              </div>
              <div className="p-4 bg-navy-900 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">ID</p>
                <p className="text-white font-mono text-sm">{locker.id}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed">
                This {locker.size} locker is located at {locker.location}.
                Perfect for storing your personal belongings safely and securely.
              </p>
            </div>
          </div>
        </div>

        {/* Reserve Panel */}
        <div className="lg:col-span-1">
          <div className="glass rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-white mb-4">Reserve This Locker</h2>

            {locker.status === 'available' ? (
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Select your reservation period below. You can reserve this locker for up to 30 days.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    min={formatDateString(new Date())}
                    value={reserveData.reserved_from}
                    onChange={(e) => setReserveData({ ...reserveData, reserved_from: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    min={reserveData.reserved_from || formatDateString(new Date())}
                    value={reserveData.reserved_until}
                    onChange={(e) => setReserveData({ ...reserveData, reserved_until: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
                  />
                </div>

                <button
                  onClick={() => setShowConfirmReserve(true)}
                  disabled={!reserveData.reserved_from || !reserveData.reserved_until}
                  className="w-full py-3 px-4 bg-gradient-to-r from-electric-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reserve Now
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Not Available</h3>
                <p className="text-gray-400">
                  This locker is currently {locker.status}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Reservation Modal */}
      <Modal
        isOpen={showConfirmReserve}
        onClose={() => setShowConfirmReserve(false)}
        title="Confirm Reservation"
        confirmLabel="Confirm"
        onConfirm={handleReserve}
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to reserve this locker with the following details?
          </p>
          <div className="bg-navy-900 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Locker:</span>
              <span className="text-white font-medium">{locker.locker_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-white">{locker.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">From:</span>
              <span className="text-white">
                {new Date(reserveData.reserved_from).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Until:</span>
              <span className="text-white">
                {new Date(reserveData.reserved_until).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LockerDetailPage
