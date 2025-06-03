import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const color =
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500'

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white ${color} animate-fade-in`}
      role="alert"
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white font-bold">×</button>
    </div>
  )
}

// Ajoute une animation fade-in
// Dans tailwind.config.js, ajoute :
//   animation: {
//     'fade-in': 'fadeIn 0.3s ease-in',
//   },
//   keyframes: {
//     fadeIn: {
//       '0%': { opacity: 0 },
//       '100%': { opacity: 1 },
//     },
//   }, 