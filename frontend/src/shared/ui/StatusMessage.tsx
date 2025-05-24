// components/StatusMessage.tsx
import React from 'react'

interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  icon?: boolean
  className?: string
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  title,
  message,
  icon = true,
  className = 'mb-6'
}) => {
  const styles = {
    success: {
      container: 'bg-green-50 border border-green-200 text-green-700',
      iconPath: 'M5 13l4 4L19 7'
    },
    error: {
      container: 'bg-red-50 border border-red-200 text-red-700',
      iconPath: 'M6 18L18 6M6 6l12 12'
    },
    warning: {
      container: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
      iconPath:
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z'
    },
    info: {
      container: 'bg-blue-50 border border-blue-200 text-blue-700',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }

  const currentStyle = styles[type]

  return (
    <div className={`${currentStyle.container} px-4 py-3 rounded ${className}`}>
      <div className="flex items-start">
        {icon && (
          <svg
            className="w-6 h-6 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={currentStyle.iconPath}
            />
          </svg>
        )}
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <p>{message}</p>
        </div>
      </div>
    </div>
  )
}

export default StatusMessage
