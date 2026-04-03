const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <div className="glass rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard
