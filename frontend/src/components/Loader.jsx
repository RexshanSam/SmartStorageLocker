const Loader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="glass rounded-xl p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
          <div className="h-6 w-16 bg-white/10 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="h-3 bg-white/10 rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="h-8 bg-white/10 rounded w-1/4"></div>
        </div>
        <div className="divide-y divide-white/10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'stat') {
    return (
      <div className="glass rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
        <div className="h-10 bg-white/10 rounded w-1/2"></div>
      </div>
    )
  }

  return null
}

export default Loader
