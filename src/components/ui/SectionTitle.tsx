import { type ReactNode } from 'react'

interface SectionTitleProps {
  children: ReactNode
  className?: string
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`text-xl font-semibold text-gray-900 mb-4 ${className}`}>
      {children}
    </h2>
  )
} 