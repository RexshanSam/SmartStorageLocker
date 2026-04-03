import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

export default function Layout() {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      overflowX: "hidden",
      boxSizing: "border-box"
    }}>
      <Navbar />
      <main style={{
        flex: "1 1 auto",
        width: "100%",
        background: "#0f172a",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
        padding: "2rem 3rem",
      }}>
        <Outlet />
      </main>
    </div>
  )
}
