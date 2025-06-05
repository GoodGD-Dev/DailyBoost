import React from 'react'
import { motion } from 'framer-motion'
import { pageAnimations } from '@shared'

// ========== INTERFACE SIMPLIFICADA ==========
export interface AuthLayoutProps {
  title: string
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg'
}

// ========== COMPONENTE PRINCIPAL ==========
const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  children,
  className = '',
  maxWidth = 'md'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  }

  return (
    <motion.div
      className={`${maxWidthClasses[maxWidth]} mx-auto ${className}`}
      variants={pageAnimations.container}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="theme-card p-6" variants={pageAnimations.item}>
        <motion.h1
          className="text-2xl font-bold text-center mb-6 theme-text-gray-800"
          variants={pageAnimations.item}
        >
          {title}
        </motion.h1>
        {children}
      </motion.div>
    </motion.div>
  )
}

export default AuthLayout
