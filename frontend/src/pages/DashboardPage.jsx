import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { lockerAPI } from '../api/lockerAPI'
import { reservationAPI } from '../api/reservationAPI'

const cardStyle = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "16px",
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
  transition: "border-color 0.2s, transform 0.2s",
  cursor: "default"
}

const actionCardStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "16px",
  padding: "1.25rem 1.5rem",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  cursor: "pointer",
  transition: "all 0.2s",
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  textDecoration: "none",
  color: "inherit"
}

const iconBoxStyle = (color) => ({
  padding: "0.75rem",
  background: `${color}/20`,
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
})

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalLockers: 0,
    availableLockers: 0,
    reservedLockers: 0,
    maintenanceLockers: 0,
    myReservations: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      const [lockersRes, reservationsRes] = await Promise.all([
        lockerAPI.getAll(),
        reservationAPI.getAll(),
      ])

      const lockers = lockersRes.data.results || lockersRes.data
      const totalLockers = lockers.length
      const availableLockers = lockers.filter(l => l.status === 'available').length
      const reservedLockers = lockers.filter(l => l.status === 'reserved').length
      const maintenanceLockers = lockers.filter(l => l.status === 'maintenance').length

      let myReservations = 0
      if (user?.role === 'user') {
        myReservations = (reservationsRes.data.results || reservationsRes.data)
          .filter(r => r.user === user.id && r.status === 'active').length
      } else {
        myReservations = (reservationsRes.data.results || reservationsRes.data)
          .filter(r => r.status === 'active').length
      }

      setStats({
        totalLockers,
        availableLockers,
        reservedLockers,
        maintenanceLockers,
        myReservations,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardMouseEnter = (e) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"
    e.currentTarget.style.transform = "translateY(-2px)"
  }

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
    e.currentTarget.style.transform = "translateY(0)"
  }

  const handleActionCardMouseEnter = (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.12)"
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"
    e.currentTarget.style.transform = "translateY(-2px)"
  }

  const handleActionCardMouseLeave = (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.06)"
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
    e.currentTarget.style.transform = "translateY(0)"
  }

  if (loading) {
    return (
      <div style={{
        width: "100%",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        boxSizing: "border-box",
        padding: "2rem 3rem"
      }}>
        <div style={{ height: '3rem', width: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '0.5rem' }}></div>
        <div style={{ height: '1.25rem', width: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}></div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.25rem",
          marginTop: "2rem",
          marginBottom: "2rem"
        }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={cardStyle}>
              <div style={{ height: '2rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '60%' }}></div>
              <div style={{ height: '3rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
            </div>
          ))}
        </div>
        <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}></div>
      </div>
    )
  }

  const statCards = [
    {
      label: "Total Lockers",
      value: stats.totalLockers,
      color: "#3b82f6",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: "Available",
      value: stats.availableLockers,
      color: "#22c55e",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      label: "Reserved",
      value: stats.reservedLockers,
      color: "#ef4444",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: user?.role === 'admin' ? 'All Active' : 'My Active',
      value: stats.myReservations,
      color: "#f59e0b",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      boxSizing: "border-box",
      padding: "2rem 3rem"
    }}>

      {/* Welcome Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "0.5rem"
        }}>
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
          Here's your LockVault overview
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2.5rem",
        width: "100%"
      }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={cardStyle}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem"
            }}>
              <span style={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: "500" }}>
                {card.label}
              </span>
              <div style={iconBoxStyle(card.color)}>{card.icon}</div>
            </div>
            <p style={{
              fontSize: "2.75rem",
              fontWeight: "bold",
              color: card.color,
              lineHeight: "1"
            }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "1.25rem",
          color: "white"
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          width: "100%"
        }}>
          <Link
            to="/lockers"
            style={actionCardStyle}
            onMouseEnter={handleActionCardMouseEnter}
            onMouseLeave={handleActionCardMouseLeave}
          >
            <div style={iconBoxStyle("#3b82f6")}>
              <svg className="w-6 h-6 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                Browse Lockers
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>View and reserve available lockers</p>
            </div>
          </Link>

          <Link
            to="/my-reservations"
            style={actionCardStyle}
            onMouseEnter={handleActionCardMouseEnter}
            onMouseLeave={handleActionCardMouseLeave}
          >
            <div style={iconBoxStyle("#22c55e")}>
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                My Reservations
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>View and manage your reservations</p>
            </div>
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin/lockers"
              style={actionCardStyle}
              onMouseEnter={handleActionCardMouseEnter}
              onMouseLeave={handleActionCardMouseLeave}
            >
              <div style={iconBoxStyle("#f59e0b")}>
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                  Manage Lockers
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Admin: Create, edit, delete lockers</p>
              </div>
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              to="/admin/reservations"
              style={actionCardStyle}
              onMouseEnter={handleActionCardMouseEnter}
              onMouseLeave={handleActionCardMouseLeave}
            >
              <div style={iconBoxStyle("#8b5cf6")}>
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                  All Reservations
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Admin: View and manage all bookings</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* System Status */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "1.5rem"
      }}>
        <h2 style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "1rem",
          color: "white"
        }}>
          System Status
        </h2>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#22c55e",
            animation: "pulse 2s infinite"
          }}></div>
          <span style={{ color: "#cbd5e1" }}>
            LockVault is running normally
          </span>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
