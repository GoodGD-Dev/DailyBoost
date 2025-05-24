import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

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
      <div className="card">
        <div className="flex flex-col justify-center items-center h-40">
          <div
            className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3`}
          ></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
