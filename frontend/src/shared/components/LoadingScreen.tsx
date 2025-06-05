import React from 'react'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '@shared'

const LoadingScreen: React.FC = () => {
  return (
    // ===== OVERLAY DE TELA CHEIA =====
    <div className="fixed inset-0 theme-bg-gray-50 flex justify-center items-center z-50">
      <motion.div
        className="flex flex-col items-center"
        // ===== ANIMAÇÃO DE FADE IN =====
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingSpinner message="Carregando..." size="lg" className="" />
      </motion.div>
    </div>
  )
}

export default LoadingScreen
