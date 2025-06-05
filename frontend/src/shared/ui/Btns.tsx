import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { BtnsProps } from '@shared'

// ========== COMPONENTE PRINCIPAL ==========
const Btns: React.FC<BtnsProps> = ({
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

  // ========== TAMANHOS ==========
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  // ========== VARIANTES ==========
  const getVariantClasses = () => {
    if (isDisabled) {
      return 'theme-bg-gray-300 theme-text-gray-500 cursor-not-allowed border-transparent'
    }

    switch (variant) {
      case 'primary':
        return 'theme-btn-primary'
      case 'secondary':
        return 'theme-btn-secondary'
      default:
        return 'theme-btn-primary'
    }
  }

  // ========== CONSTRUÇÃO DAS CLASSES ==========
  const buttonClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${getVariantClasses()}
    font-medium rounded-lg transition-all duration-200
    flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variant === 'primary' && !isDisabled ? 'focus:ring-primary-500' : ''}
    ${variant === 'secondary' && !isDisabled ? 'focus:ring-gray-300' : ''}
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
      <span className={loading || icon ? 'ml-2' : ''}>
        {loading ? 'Carregando...' : text}
      </span>
    </motion.button>
  )
}

export default Btns
