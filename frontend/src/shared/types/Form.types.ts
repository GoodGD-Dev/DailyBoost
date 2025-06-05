import { FieldInputProps } from 'formik'

export interface FormInputProps {
  id: string
  label: string
  type?: string
  error?: string
  touched?: boolean
  fieldProps: FieldInputProps<string>
  className?: string
  placeholder?: string
}
