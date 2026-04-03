import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const savedUser = localStorage.getItem("user")

    if (savedUser) {
      try { setUser(JSON.parse(savedUser)) } catch { setUser(null) }
    }

    if (token) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data)
        localStorage.setItem("user", JSON.stringify(res.data))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/login/`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    )
    localStorage.setItem("access_token", res.data.access)
    localStorage.setItem("refresh_token", res.data.refresh)
    localStorage.setItem("user", JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const register = async (name, email, password, role) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/register/`,
      { name, email, password, role },
      { headers: { "Content-Type": "application/json" } }
    )
    localStorage.setItem("access_token", res.data.access)
    localStorage.setItem("refresh_token", res.data.refresh)
    localStorage.setItem("user", JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
