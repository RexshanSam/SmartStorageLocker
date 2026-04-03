import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { reservationAPI } from '../api/reservationAPI'
import ReservationCard from '../components/ReservationCard.jsx'
import Loader from '../components/Loader.jsx'
import Modal from '../components/Modal.jsx'
import toast from 'react-hot-toast'

const MyReservationsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [releaseId, setReleaseId] = useState(null)
  const [releaseReason, setReleaseReason] = useState('')

  useEffect(() => {
    fetchReservations()
  }, [user])

  const fetchReservations = async () => {
    try {
      const response = await reservationAPI.getAll()
      setReservations(response.data.results || response.data)
    } catch (error) {
      toast.error('Failed to load reservations')
    } finally {
      setLoading(false)
    }
  }

  const handleRelease = async () => {
    try {
      await reservationAPI.release(releaseId, releaseReason)
      toast.success('Reservation released successfully')
      setReleaseId(null)
      setReleaseReason('')
      fetchReservations()
    } catch (error) {
      toast.error('Failed to release reservation')
    }
  }

  const myReservations = user?.role === 'admin'
    ? reservations
    : reservations.filter((r) => r.user.id === user?.id)

  if (loading) {
    return (
      <div className="space-y-6">
        <Loader type="table" />
      </div>
    )
  }

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.role === 'admin' ? 'All Reservations' : 'My Reservations'}
          </h1>
          <p className="text-gray-400">
            {user?.role === 'admin'
              ? 'View and manage all locker reservations'
              : 'View and manage your locker reservations'}
          </p>
        </div>
      </div>

      {myReservations.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.217a.75.75 0 00-.712 1.28l.288.474c.538.85.993 1.933.993 3.094 0 2.488-1.484 4.52-3.74 5.88a.75.75 0 00.78 1.36l.074.067c.093.085.205.147.325.197a.75.75 0 00.937-.066l.048-.009c.109-.02.196-.058.262-.114.316-.325.58-1.025.58-1.973 0-.948-.264-1.65-.744-2.15-.122-.13-.238-.24-.37-.333s-.24-.117-.37-.178c-.15-.072-.28-.15-.414-.218a.75.75 0 00-.765-.033l-.01.012c-.093.106-.183.218-.269.336a.75.75 0 00.713 1.28l.287-.474c.538-.85.993-1.933.993-3.094 0-2.488-1.484-4.52-3.74-5.88a.75.75 0 00-.78-1.36l-.074-.067c-.093-.085-.205-.147-.325-.197a.75.75 0 00-.937.066l-.048.009c-.109.02-.196.058-.262.114-.316.325-.58 1.025-.58 1.973 0 .948.264 1.65.744 2.15.122.13.238.24.37.333.063.048.135.078.203.089.07.011.14.016.21.004.07-.012.133-.032.199-.061.316-.14.584-.517.584-.932 0-.416-.268-1.372-.841-2.332-.101-.172-.219-.33-.348-.473-.13-.143-.248-.285-.37-.424z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No reservations yet</h3>
          <p className="text-gray-400 mb-6">
            {user?.role === 'admin'
              ? 'No reservations have been made yet.'
              : "You haven't made any reservations yet."}
          </p>
          {user?.role !== 'admin' && (
            <button
              onClick={() => navigate('/lockers')}
              className="px-6 py-3 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Lockers
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              currentUserId={user?.id}
              onRelease={() => setReleaseId(reservation.id)}
            />
          ))}
        </div>
      )}

      {/* Release Confirmation Modal */}
      <Modal
        isOpen={!!releaseId}
        onClose={() => {
          setReleaseId(null)
          setReleaseReason('')
        }}
        title="Release Reservation"
        confirmLabel="Release"
        onConfirm={handleRelease}
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to release this reservation? This action cannot be undone.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason (optional)
            </label>
            <textarea
              value={releaseReason}
              onChange={(e) => setReleaseReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-navy-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
              placeholder="Why are you releasing this reservation?"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MyReservationsPage
