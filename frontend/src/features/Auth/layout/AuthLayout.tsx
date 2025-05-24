import React from 'react'
import { motion } from 'framer-motion'
import { formVariants } from '@features'

interface AuthLayoutProps {
  title: string
  children: React.ReactNode
  className?: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  children,
  className = 'max-w-md mx-auto'
}) => {
  return (
    <motion.div
      className={className}
      variants={formVariants.container}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        variants={formVariants.item}
      >
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          variants={formVariants.item}
        >
          {title}
        </motion.h2>
        {children}
      </motion.div>
    </motion.div>
  )
}

export default AuthLayout
