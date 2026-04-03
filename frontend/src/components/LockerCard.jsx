import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'

const LockerCard = ({ locker }) => {
  const navigate = useNavigate()

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

  const cardStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    cursor: "pointer",
    transition: "all 0.2s"
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"
    e.currentTarget.style.transform = "translateY(-4px)"
    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)"
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
    e.currentTarget.style.transform = "translateY(0)"
    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)"
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available':
        return { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.5)' }
      case 'reserved':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.5)' }
      case 'maintenance':
        return { bg: 'rgba(250, 204, 21, 0.2)', text: '#facc15', border: 'rgba(250, 204, 21, 0.5)' }
      default:
        return { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.5)' }
    }
  }

  const statusColors = getStatusBadgeColor(locker.status)

  return (
    <div
      style={cardStyle}
      onClick={() => navigate(`/lockers/${locker.id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "white", marginBottom: "0.25rem" }}>
            Locker {locker.locker_number}
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{locker.location}</p>
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
          {locker.status.charAt(0).toUpperCase() + locker.status.slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-2 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>{getSizeLabel(locker.size)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <p style={{ color: "#64748b", fontSize: "0.75rem" }}>
          ID: {locker.id}
        </p>
      </div>
    </div>
  )
}

export default LockerCard
