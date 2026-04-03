import { useEffect, useState } from "react"
import axiosInstance from "../../api/axiosInstance"

export default function AdminLockersPage() {
  const [lockers, setLockers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLocker, setSelectedLocker] = useState(null)
  const [form, setForm] = useState({
    locker_number: "",
    location: "",
    size: "small",
    status: "available"
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchLockers = () => {
    setLoading(true)
    axiosInstance.get("/lockers/")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data
                     : res.data.results || []
        setLockers(data)
        setFiltered(data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLockers() }, [])

  useEffect(() => {
    if (!search) { setFiltered(lockers); return }
    setFiltered(lockers.filter(l =>
      l.locker_number?.toString().toLowerCase()
        .includes(search.toLowerCase()) ||
      l.location?.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, lockers])

  const showToast = (msg, isError = false) => {
    if (isError) setError(msg)
    else setSuccess(msg)
    setTimeout(() => { setError(""); setSuccess("") }, 3000)
  }

  const handleAdd = async () => {
    try {
      await axiosInstance.post("/lockers/", form)
      showToast("Locker added successfully!")
      setShowAddModal(false)
      setForm({ locker_number:"", location:"", size:"small", status:"available" })
      fetchLockers()
    } catch (err) {
      showToast(
        err.response?.data?.locker_number?.[0] ||
        "Failed to add locker", true)
    }
  }

  const handleEdit = async () => {
    try {
      await axiosInstance.put(
        `/lockers/${selectedLocker.id}/`, form)
      showToast("Locker updated successfully!")
      setShowEditModal(false)
      fetchLockers()
    } catch (err) {
      showToast("Failed to update locker", true)
    }
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/lockers/${selectedLocker.id}/`)
      showToast("Locker deleted successfully!")
      setShowDeleteModal(false)
      fetchLockers()
    } catch (err) {
      showToast("Failed to delete locker", true)
    }
  }

  const openEdit = (locker) => {
    setSelectedLocker(locker)
    setForm({
      locker_number: locker.locker_number,
      location: locker.location,
      size: locker.size,
      status: locker.status
    })
    setShowEditModal(true)
  }

  const statusColor = (s) =>
    s === "available" ? "#4ade80" :
    s === "reserved"  ? "#f87171" : "#fbbf24"

  const inputStyle = {
    width: "100%", padding: "0.6rem 0.8rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px", color: "white",
    fontSize: "0.95rem", outline: "none",
    boxSizing: "border-box"
  }

  const labelStyle = {
    display: "block", color: "#94a3b8",
    fontSize: "0.85rem", marginBottom: "0.4rem"
  }

  const FormFields = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div>
        <label style={labelStyle}>Locker Number</label>
        <input style={inputStyle} value={form.locker_number}
          onChange={e => setForm({...form, locker_number: e.target.value})}
          placeholder="e.g. L021" />
      </div>
      <div>
        <label style={labelStyle}>Location</label>
        <input style={inputStyle} value={form.location}
          onChange={e => setForm({...form, location: e.target.value})}
          placeholder="e.g. North Wing - Floor 1" />
      </div>
      <div>
        <label style={labelStyle}>Size</label>
        <select style={inputStyle} value={form.size}
          onChange={e => setForm({...form, size: e.target.value})}>
          <option value="small"  style={{background:"#1e293b"}}>Small</option>
          <option value="medium" style={{background:"#1e293b"}}>Medium</option>
          <option value="large"  style={{background:"#1e293b"}}>Large</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Status</label>
        <select style={inputStyle} value={form.status}
          onChange={e => setForm({...form, status: e.target.value})}>
          <option value="available"   style={{background:"#1e293b"}}>Available</option>
          <option value="reserved"    style={{background:"#1e293b"}}>Reserved</option>
          <option value="maintenance" style={{background:"#1e293b"}}>Maintenance</option>
        </select>
      </div>
    </div>
  )

  const Modal = ({ title, onClose, onConfirm, confirmText, confirmColor="#2563eb", children }) => (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"rgba(0,0,0,0.7)",
      display:"flex", alignItems:"center", justifyContent:"center"
    }}>
      <div style={{
        background:"#1e293b", borderRadius:"16px",
        padding:"2rem", width:"100%", maxWidth:"480px",
        border:"1px solid rgba(255,255,255,0.1)"
      }}>
        <h3 style={{
          fontSize:"1.25rem", fontWeight:"bold",
          color:"white", marginBottom:"1.5rem"
        }}>{title}</h3>
        {children}
        <div style={{
          display:"flex", gap:"1rem",
          justifyContent:"flex-end", marginTop:"1.5rem"
        }}>
          <button onClick={onClose} style={{
            padding:"0.6rem 1.2rem", borderRadius:"8px",
            border:"1px solid rgba(255,255,255,0.2)",
            background:"transparent", color:"white", cursor:"pointer"
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding:"0.6rem 1.2rem", borderRadius:"8px",
            border:"none", background:confirmColor,
            color:"white", cursor:"pointer", fontWeight:"600"
          }}>{confirmText}</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ width:"100%", color:"white" }}>

      {/* Toast */}
      {(success || error) && (
        <div style={{
          position:"fixed", top:"90px", right:"2rem", zIndex:9999,
          background: error ? "#dc2626" : "#16a34a",
          color:"white", padding:"1rem 1.5rem",
          borderRadius:"10px", fontWeight:"500",
          boxShadow:"0 4px 20px rgba(0,0,0,0.3)"
        }}>
          {success || error}
        </div>
      )}

      {/* Header */}
      <div style={{
        display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:"2rem", flexWrap:"wrap",
        gap:"1rem"
      }}>
        <div>
          <h1 style={{fontSize:"2rem", fontWeight:"bold"}}>
            Manage Lockers
          </h1>
          <p style={{color:"#94a3b8", marginTop:"0.25rem"}}>
            {filtered.length} locker(s) total
          </p>
        </div>
        <button onClick={() => {
          setForm({ locker_number:"", location:"", size:"small", status:"available" })
          setShowAddModal(true)
        }} style={{
          background:"#2563eb", color:"white",
          padding:"0.75rem 1.5rem", borderRadius:"10px",
          border:"none", cursor:"pointer",
          fontWeight:"600", fontSize:"1rem"
        }}>
          + Add Locker
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom:"1.5rem" }}>
        <input value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by locker number or location..."
          style={{
            padding:"0.75rem 1rem", borderRadius:"8px",
            background:"rgba(255,255,255,0.05)", color:"white",
            border:"1px solid rgba(255,255,255,0.15)",
            outline:"none", maxWidth:"400px", width:"100%",
            boxSizing:"border-box"
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
              {["#","Locker No.","Location","Size","Status","Created","Actions"].map(h => (
                <th key={h} style={{
                  padding:"1rem", textAlign:"left",
                  color:"#94a3b8", fontSize:"0.85rem",
                  fontWeight:"600", textTransform:"uppercase",
                  letterSpacing:"0.05em"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{
                padding:"3rem", textAlign:"center", color:"#94a3b8"
              }}>Loading lockers...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{
                padding:"3rem", textAlign:"center", color:"#94a3b8"
              }}>No lockers found</td></tr>
            ) : filtered.map((locker, i) => (
              <tr key={locker.id} style={{
                borderBottom:"1px solid rgba(255,255,255,0.05)",
                transition:"background 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{padding:"1rem", color:"#64748b"}}>{i + 1}</td>
                <td style={{padding:"1rem", fontWeight:"600", color:"#60a5fa"}}>
                  {locker.locker_number}
                </td>
                <td style={{padding:"1rem", color:"#cbd5e1"}}>
                  {locker.location}
                </td>
                <td style={{padding:"1rem", color:"#cbd5e1", textTransform:"capitalize"}}>
                  {locker.size}
                </td>
                <td style={{padding:"1rem"}}>
                  <span style={{
                    background: statusColor(locker.status) + "20",
                    color: statusColor(locker.status),
                    padding:"0.25rem 0.75rem", borderRadius:"999px",
                    fontSize:"0.8rem", fontWeight:"600",
                    textTransform:"capitalize",
                    border:`1px solid ${statusColor(locker.status)}`
                  }}>
                    {locker.status}
                  </span>
                </td>
                <td style={{padding:"1rem", color:"#64748b", fontSize:"0.85rem"}}>
                  {new Date(locker.created_at).toLocaleDateString()}
                </td>
                <td style={{padding:"1rem"}}>
                  <div style={{display:"flex", gap:"0.5rem"}}>
                    <button onClick={() => openEdit(locker)} style={{
                      padding:"0.4rem 0.9rem",
                      background:"rgba(37,99,235,0.2)",
                      color:"#60a5fa", borderRadius:"6px",
                      border:"1px solid rgba(37,99,235,0.4)",
                      cursor:"pointer", fontSize:"0.85rem"
                    }}>Edit</button>
                    <button onClick={() => {
                      setSelectedLocker(locker)
                      setShowDeleteModal(true)
                    }} style={{
                      padding:"0.4rem 0.9rem",
                      background:"rgba(220,38,38,0.2)",
                      color:"#f87171", borderRadius:"6px",
                      border:"1px solid rgba(220,38,38,0.4)",
                      cursor:"pointer", fontSize:"0.85rem"
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add New Locker"
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAdd}
          confirmText="Add Locker">
          <FormFields />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title={`Edit Locker ${selectedLocker?.locker_number}`}
          onClose={() => setShowEditModal(false)}
          onConfirm={handleEdit}
          confirmText="Save Changes"
          confirmColor="#16a34a">
          <FormFields />
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal
          title="Delete Locker"
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          confirmText="Yes, Delete"
          confirmColor="#dc2626">
          <p style={{color:"#94a3b8"}}>
            Are you sure you want to delete locker{" "}
            <strong style={{color:"white"}}>{selectedLocker?.locker_number}</strong>
            ? This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  )
}
