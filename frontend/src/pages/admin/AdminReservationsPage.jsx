import { useEffect, useState } from "react"
import axiosInstance from "../../api/axiosInstance"

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState({ msg:"", type:"" })

  const fetchReservations = () => {
    setLoading(true)
    axiosInstance.get("/reservations/")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data
                     : res.data.results || []
        setReservations(data)
        setFiltered(data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReservations() }, [])

  useEffect(() => {
    let result = [...reservations]
    if (statusFilter !== "all")
      result = result.filter(r => r.status === statusFilter)
    if (search)
      result = result.filter(r =>
        (r.user_name || r.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.locker_number || r.locker || "").toString().toLowerCase().includes(search.toLowerCase())
      )
    setFiltered(result)
  }, [statusFilter, search, reservations])

  const showToast = (msg, type="success") => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg:"", type:"" }), 3000)
  }

  const handleRelease = async () => {
    try {
      await axiosInstance.put(`/reservations/${selected.id}/release/`)
      showToast("Reservation released successfully!")
      setShowReleaseModal(false)
      fetchReservations()
    } catch (err) {
      showToast("Failed to release reservation", "error")
    }
  }

  const statusColor = (s) =>
    s === "active"   ? "#4ade80" :
    s === "released" ? "#94a3b8" : "#f87171"

  return (
    <div style={{ width:"100%", color:"white" }}>

      {/* Toast */}
      {toast.msg && (
        <div style={{
          position:"fixed", top:"90px", right:"2rem", zIndex:9999,
          background: toast.type === "error" ? "#dc2626" : "#16a34a",
          color:"white", padding:"1rem 1.5rem",
          borderRadius:"10px", fontWeight:"500"
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{fontSize:"2rem", fontWeight:"bold"}}>
          All Reservations
        </h1>
        <p style={{color:"#94a3b8", marginTop:"0.25rem"}}>
          {filtered.length} reservation(s) found
        </p>
      </div>

      {/* Filters */}
      <div style={{
        display:"flex", gap:"1rem", flexWrap:"wrap",
        marginBottom:"1.5rem", alignItems:"center"
      }}>
        <div style={{display:"flex", gap:"0.5rem"}}>
          {["all","active","released","expired"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding:"0.5rem 1rem", borderRadius:"8px",
                border:"none", cursor:"pointer", fontWeight:"500",
                background: statusFilter === s ? "#2563eb" : "rgba(255,255,255,0.08)",
                color:"white", textTransform:"capitalize"
              }}>{s}</button>
          ))}
        </div>
        <input value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by user or locker..."
          style={{
            padding:"0.5rem 1rem", borderRadius:"8px",
            background:"rgba(255,255,255,0.05)", color:"white",
            border:"1px solid rgba(255,255,255,0.15)",
            outline:"none", minWidth:"220px"
          }} />
      </div>

      {/* Table */}
      <div style={{
        background:"rgba(255,255,255,0.03)",
        border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:"12px", overflow:"hidden"
      }}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{
              background:"rgba(255,255,255,0.05)",
              borderBottom:"1px solid rgba(255,255,255,0.1)"
            }}>
              {["#","User","Locker","Location","From","Until","Status","Action"].map(h => (
                <th key={h} style={{
                  padding:"1rem", textAlign:"left",
                  color:"#94a3b8", fontSize:"0.85rem",
                  fontWeight:"600", textTransform:"uppercase"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{
                padding:"3rem", textAlign:"center", color:"#94a3b8"
              }}>Loading reservations...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{
                padding:"3rem", textAlign:"center", color:"#94a3b8"
              }}>No reservations found</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id} style={{
                borderBottom:"1px solid rgba(255,255,255,0.05)"
              }}>
                <td style={{padding:"1rem", color:"#64748b"}}>{i + 1}</td>
                <td style={{padding:"1rem", color:"#cbd5e1", fontWeight:"500"}}>
                  {r.user_name || r.user?.email || r.user}
                </td>
                <td style={{padding:"1rem", color:"#60a5fa", fontWeight:"600"}}>
                  {r.locker_number || r.locker}
                </td>
                <td style={{padding:"1rem", color:"#94a3b8"}}>
                  {r.locker_location || "—"}
                </td>
                <td style={{padding:"1rem", color:"#94a3b8", fontSize:"0.85rem"}}>
                  {new Date(r.reserved_from).toLocaleString()}
                </td>
                <td style={{padding:"1rem", color:"#94a3b8", fontSize:"0.85rem"}}>
                  {new Date(r.reserved_until).toLocaleString()}
                </td>
                <td style={{padding:"1rem"}}>
                  <span style={{
                    background: statusColor(r.status) + "20",
                    color: statusColor(r.status),
                    padding:"0.25rem 0.75rem", borderRadius:"999px",
                    fontSize:"0.8rem", fontWeight:"600", textTransform:"capitalize",
                    border:`1px solid ${statusColor(r.status)}`
                  }}>{r.status}</span>
                </td>
                <td style={{padding:"1rem"}}>
                  {r.status === "active" && (
                    <button onClick={() => {
                      setSelected(r)
                      setShowReleaseModal(true)
                    }} style={{
                      padding:"0.4rem 0.9rem",
                      background:"rgba(220,38,38,0.2)",
                      color:"#f87171", borderRadius:"6px",
                      border:"1px solid rgba(220,38,38,0.4)",
                      cursor:"pointer", fontSize:"0.85rem"
                    }}>Release</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Release Modal */}
      {showReleaseModal && (
        <div style={{
          position:"fixed", inset:0, zIndex:9999,
          background:"rgba(0,0,0,0.7)",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <div style={{
            background:"#1e293b", borderRadius:"16px",
            padding:"2rem", width:"100%", maxWidth:"420px",
            border:"1px solid rgba(255,255,255,0.1)"
          }}>
            <h3 style={{
              fontSize:"1.2rem", fontWeight:"bold",
              color:"white", marginBottom:"1rem"
            }}>Release Reservation</h3>
            <p style={{color:"#94a3b8", marginBottom:"1.5rem"}}>
              Release the reservation for locker{" "}
              <strong style={{color:"white"}}>{selected?.locker_number}</strong>{" "}
              by{" "}
              <strong style={{color:"white"}}>{selected?.user_name}</strong>?
            </p>
            <div style={{display:"flex", gap:"1rem", justifyContent:"flex-end"}}>
              <button onClick={() => setShowReleaseModal(false)} style={{
                padding:"0.6rem 1.2rem", borderRadius:"8px",
                border:"1px solid rgba(255,255,255,0.2)",
                background:"transparent", color:"white", cursor:"pointer"
              }}>Cancel</button>
              <button onClick={handleRelease} style={{
                padding:"0.6rem 1.2rem", borderRadius:"8px",
                border:"none", background:"#dc2626",
                color:"white", cursor:"pointer", fontWeight:"600"
              }}>Release</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
