import React from 'react'
import { motion } from 'framer-motion'
import { pageAnimations } from '@features'
import { FieldInputProps } from 'formik'

// ========== INTERFACE SIMPLIFICADA ==========
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

// ========== COMPONENTE PRINCIPAL ==========
const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  error,
  touched,
  fieldProps,
  className = 'mb-4',
  placeholder
}) => {
  return (
    <motion.div className={className} variants={pageAnimations.item}>
      <label htmlFor={id} className="block text-gray-700 mb-2 font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...fieldProps}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${
            touched && error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }
        `}
      />
      {touched && error && (
        <div className="text-red-600 text-sm mt-1 flex items-center">
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </motion.div>
  )
}

export default FormInput
