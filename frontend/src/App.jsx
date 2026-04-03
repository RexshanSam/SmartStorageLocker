import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Layout from "./components/Layout"
import ProtectedRoute from "./routes/ProtectedRoute"
import AdminRoute from "./routes/AdminRoute"

import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import LockersPage from "./pages/LockersPage"
import LockerDetailPage from "./pages/LockerDetailPage"
import MyReservationsPage from "./pages/MyReservationsPage"
import AdminLockersPage from "./pages/admin/AdminLockersPage"
import AdminReservationsPage from "./pages/admin/AdminReservationsPage"
import NotFoundPage from "./pages/NotFoundPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/lockers" element={<LockersPage />} />
            <Route path="/lockers/:id" element={<LockerDetailPage />} />
            <Route path="/my-reservations" element={<MyReservationsPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin/lockers" element={<AdminLockersPage />} />
              <Route path="/admin/reservations" element={<AdminReservationsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
