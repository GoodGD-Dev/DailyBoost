import React from 'react'
import { motion } from 'framer-motion'

interface FormButtonProps {
  text: string
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const FormButton: React.FC<FormButtonProps> = ({
  text,
  loading = false,
  disabled = false,
  type = 'submit'
}) => {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      className={`w-full btn btn-primary flex justify-center items-center ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {text}
    </motion.button>
  )
}

export default FormButton
