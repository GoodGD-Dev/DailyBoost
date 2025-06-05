import React from 'react'
import { LoadingSpinnerProps } from '@shared'

// ========== COMPONENTE PRINCIPAL ==========
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Carregando...',
  size = 'md',
  className = 'max-w-md mx-auto'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={className}>
      <div className="theme-card">
        <div className="flex flex-col justify-center items-center h-40">
          <div className={`${sizeClasses[size]} theme-spinner mb-3`}></div>
          <p className="theme-text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
