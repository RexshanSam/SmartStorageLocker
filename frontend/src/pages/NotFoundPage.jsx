import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="w-32 h-32 text-electric-blue/20 mx-auto"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-electric-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/lockers"
            className="px-6 py-3 glass hover:bg-white/10 text-gray-300 rounded-lg transition-colors border border-white/10"
          >
            Browse Lockers
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
