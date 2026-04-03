import { useState, useEffect } from 'react'

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const end = new Date(endTime).getTime()
    const now = new Date().getTime()
    const difference = end - now

    if (difference <= 0) {
      return { expired: true }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, expired: false }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  if (timeLeft.expired) {
    return (
      <div className="text-red-400 font-medium">
        Expired
      </div>
    )
  }

  const { days, hours, minutes, seconds } = timeLeft

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex flex-col items-center bg-white/10 rounded px-2 py-1">
        <span className="font-bold text-white text-lg">{days}</span>
        <span className="text-xs text-gray-400">days</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded px-2 py-1">
        <span className="font-bold text-white text-lg">{hours.toString().padStart(2, '0')}</span>
        <span className="text-xs text-gray-400">hrs</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded px-2 py-1">
        <span className="font-bold text-white text-lg">{minutes.toString().padStart(2, '0')}</span>
        <span className="text-xs text-gray-400">min</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded px-2 py-1">
        <span className="font-bold text-white text-lg">{seconds.toString().padStart(2, '0')}</span>
        <span className="text-xs text-gray-400">sec</span>
      </div>
    </div>
  )
}

export default CountdownTimer
