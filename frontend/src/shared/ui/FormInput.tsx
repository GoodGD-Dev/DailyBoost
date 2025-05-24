import React from 'react'
import { motion } from 'framer-motion'
import { formVariants } from '@features'
import { FieldInputProps } from 'formik'

interface FormInputProps {
  id: string
  label: string
  type?: string
  error?: string
  touched?: boolean
  fieldProps: FieldInputProps<string>
  className?: string
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  error,
  touched,
  fieldProps,
  className = 'mb-4'
}) => {
  return (
    <motion.div className={className} variants={formVariants.item}>
      <label htmlFor={id} className="block text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...fieldProps}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      {touched && error && (
        <div className="text-red-600 text-sm mt-1">{error}</div>
      )}
    </motion.div>
  )
}

export default FormInput
