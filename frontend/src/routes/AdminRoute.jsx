import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "center", minHeight: "50vh"
    }}>
      <div style={{
        width: "40px", height: "40px",
        border: "4px solid rgba(255,255,255,0.1)",
        borderTop: "4px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />

  return <Outlet />
}
