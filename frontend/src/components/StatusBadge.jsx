const StatusBadge = ({ status }) => {
  const getBadgeStyles = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-400 border border-green-500/50'
      case 'reserved':
        return 'bg-red-500/20 text-red-400 border border-red-500/50'
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
    }
  }

  const getLabel = (status) => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'reserved':
        return 'Reserved'
      case 'maintenance':
        return 'Maintenance'
      default:
        return status
    }
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyles(status)}`}>
      {getLabel(status)}
    </span>
  )
}

export default StatusBadge
