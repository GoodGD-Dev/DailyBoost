export interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  icon?: boolean
  className?: string
}
