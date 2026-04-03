import { useEffect, useRef } from 'react'

const Modal = ({ isOpen, onClose, title, children, confirmLabel = 'Confirm', onConfirm, showConfirm = true }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="glass rounded-xl w-full max-w-md border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

        {showConfirm && (
          <div className="flex justify-end space-x-3 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm?.()
                onClose()
              }}
              className="px-4 py-2 rounded-lg bg-electric-blue hover:bg-blue-600 text-white transition-colors"
            >
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
