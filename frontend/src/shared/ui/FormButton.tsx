import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { FormButtonProps } from '@shared'

// ========== VARIANTES DE ESTILO ==========
const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600',
  success: 'bg-green-600 hover:bg-green-700 text-white border-green-600',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500',
  error: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
  ghost:
    'bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

// ========== COMPONENTE PRINCIPAL ==========
const FormButton: React.FC<FormButtonProps> = ({
  text,
  loading = false,
  disabled = false,
  type = 'submit',
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  onClick,
  icon,
  className = ''
}) => {
  const isDisabled = disabled || loading

  const buttonClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${sizes[size]}
    ${variants[variant]}
    flex items-center justify-center gap-2
    font-medium rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    transform-gpu
    ${
      isDisabled
        ? 'opacity-60 cursor-not-allowed'
        : 'hover:shadow-md active:shadow-sm'
    }
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={buttonClasses}
      // ========== ANIMAÇÕES FRAMER MOTION ==========
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isDisabled ? { scale: 0.98, y: 0 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut'
      }}
    >
      {/* ========== CONTEÚDO DO BOTÃO ========== */}
      {/* Ícone personalizado ou spinner de loading */}
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="flex items-center">{icon}</span>
      ) : null}

      {/* Texto do botão */}
      <span className={loading ? 'ml-1' : ''}>
        {loading ? 'Carregando...' : text}
      </span>
    </motion.button>
  )
}

export default FormButton
