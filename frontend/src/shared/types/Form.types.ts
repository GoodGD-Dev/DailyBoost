export interface FormButtonProps {
  text: string
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  onClick?: () => void
  icon?: React.ReactNode
  className?: string
}

import { FieldInputProps } from 'formik'

export interface FormInputProps {
  id: string
  label: string
  type?: string
  error?: string
  touched?: boolean
  fieldProps: FieldInputProps<string>
  className?: string
}
