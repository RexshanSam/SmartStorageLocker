import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLockers } from '../hooks/useLockers'
import LockerCard from '../components/LockerCard.jsx'
import Loader from '../components/Loader.jsx'

const LockersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { lockers, loading, fetchLockers } = useLockers()

  const [statusTab, setStatusTab] = useState(searchParams.get('status') || 'all')
  const [sizeFilter, setSizeFilter] = useState(searchParams.get('size') || 'all')

  useEffect(() => {
    const params = {}
    if (statusTab !== 'all') params.status = statusTab
    if (sizeFilter !== 'all') params.size = sizeFilter
    fetchLockers(params)
  }, [statusTab, sizeFilter, fetchLockers])

  const handleStatusTabChange = (status) => {
    setStatusTab(status)
    const newParams = new URLSearchParams(searchParams)
    if (status === 'all') {
      newParams.delete('status')
    } else {
      newParams.set('status', status)
    }
    setSearchParams(newParams)
  }

  const handleSizeFilterChange = (size) => {
    setSizeFilter(size)
    const newParams = new URLSearchParams(searchParams)
    if (size === 'all') {
      newParams.delete('size')
    } else {
      newParams.set('size', size)
    }
    setSearchParams(newParams)
  }

  const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'available', label: 'Available' },
    { key: 'reserved', label: 'Reserved' },
    { key: 'maintenance', label: 'Maintenance' },
  ]

  const sizeOptions = [
    { key: 'all', label: 'All Sizes' },
    { key: 'small', label: 'Small' },
    { key: 'medium', label: 'Medium' },
    { key: 'large', label: 'Large' },
  ]

  return (
    <div style={{
      width: "100%",
      color: "white",
      boxSizing: "border-box"
    }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Lockers</h1>
        <p className="text-gray-400">Browse and reserve storage lockers</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleStatusTabChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusTab === tab.key
                    ? 'bg-electric-blue text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Size Filter */}
          <div className="ml-auto">
            <select
              value={sizeFilter}
              onChange={(e) => handleSizeFilterChange(e.target.value)}
              className="bg-navy-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
            >
              {sizeOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lockers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Loader key={i} type="card" />
          ))}
        </div>
      ) : lockers.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">No lockers found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockers.map((locker) => (
            <LockerCard key={locker.id} locker={locker} />
          ))}
        </div>
      )}
    </div>
  )
}

export default LockersPage
