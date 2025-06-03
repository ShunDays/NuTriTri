import { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  )
} 