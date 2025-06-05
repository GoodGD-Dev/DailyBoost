import React from 'react'
import { motion } from 'framer-motion'
import { FormInputProps, pageAnimations } from '@shared'

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
      <label htmlFor={id} className="theme-label">
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...fieldProps}
        className={`
          theme-input
          ${touched && error ? 'theme-input-error' : ''}
        `.trim()}
      />

      {touched && error && (
        <div className="theme-error-message">
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
