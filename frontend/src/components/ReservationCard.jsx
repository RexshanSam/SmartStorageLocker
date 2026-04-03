import { useState, useEffect } from 'react'
import CountdownTimer from './CountdownTimer.jsx'

const ReservationCard = ({ reservation, onRelease, currentUserId }) => {
  const [showCountdown, setShowCountdown] = useState(false)

  const isOwner = reservation.user.id === currentUserId
  const canRelease = isOwner && reservation.status === 'active'

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.5)' }
      case 'released':
        return { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.5)' }
      case 'expired':
        return { bg: 'rgba(250, 204, 21, 0.2)', text: '#facc15', border: 'rgba(250, 204, 21, 0.5)' }
      default:
        return { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.5)' }
    }
  }

  const cardStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    transition: "all 0.2s",
    cursor: "default"
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"
    e.currentTarget.style.transform = "translateY(-2px)"
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
    e.currentTarget.style.transform = "translateY(0)"
  }

  const statusColors = getStatusBadgeColor(reservation.status)

  return (
    <div
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "white", marginBottom: "0.25rem" }}>
            Locker {reservation.locker_details.locker_number}
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{reservation.locker_details.location}</p>
        </div>
        <span style={{
          background: statusColors.bg,
          color: statusColors.text,
          border: `1px solid ${statusColors.border}`,
          padding: "0.25rem 0.75rem",
          borderRadius: "999px",
          fontSize: "0.75rem",
          fontWeight: "600",
          textTransform: "capitalize"
        }}>
          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start text-sm">
          <svg className="w-4 h-4 mr-2 mt-0.5 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>From: {formatDate(reservation.reserved_from)}</p>
            <p style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>Until: {formatDate(reservation.reserved_until)}</p>
          </div>
        </div>

        {reservation.status === 'active' && (
          <div className="mt-3">
            <button
              onClick={() => setShowCountdown(!showCountdown)}
              style={{
                background: "transparent",
                border: "none",
                color: "#3b82f6",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                textDecoration: "underline"
              }}
            >
              {showCountdown ? 'Hide' : 'Show'} countdown
            </button>
            {showCountdown && (
              <div className="mt-2" style={{ background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "8px" }}>
                <CountdownTimer endTime={reservation.reserved_until} />
              </div>
            )}
          </div>
        )}
      </div>

      {canRelease && (
        <button
          onClick={onRelease}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            borderRadius: "8px",
            color: "#ef4444",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.9rem",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)"
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.7)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)"
          }}
        >
          Release Locker
        </button>
      )}
    </div>
  )
}

export default ReservationCard
