import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowDropdown(false)
  }

  return (
    <nav className="glass" style={{
      width: "100%",
      height: "70px",
      minHeight: "70px",
      padding: "0 3rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#0d1526",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      boxSizing: "border-box",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      flexShrink: 0
    }}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", width: "100%" }}>
        <div className="flex items-center justify-between w-full h-full">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-white font-bold" style={{ fontSize: "1.4rem" }}>LockVault</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
              style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
            >
              Dashboard
            </Link>
            <Link
              to="/lockers"
              className="text-gray-300 hover:text-white transition-colors"
              style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
            >
              Lockers
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin/lockers"
                className="text-gray-300 hover:text-white transition-colors"
                style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
              >
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-sm">
                <p className="text-white font-medium">{user?.name || 'User'}</p>
                <p className="text-gray-400 text-xs capitalize">{user?.role || 'User'}</p>
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg border border-white/10 py-1">
                <Link
                  to="/my-reservations"
                  className="block px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  My Reservations
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
