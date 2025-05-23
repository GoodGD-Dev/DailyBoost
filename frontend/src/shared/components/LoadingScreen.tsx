import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen: React.FC = () => {
  return (
    // ===== OVERLAY DE TELA CHEIA =====
    <div className="fixed inset-0 bg-gray-50 flex justify-center items-center z-50">
      <motion.div
        className="flex flex-col items-center"
        // ===== ANIMAÇÃO DE FADE IN =====
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* ===== SPINNER ROTATIVO ===== */}
        <motion.div
          // ===== ANIMAÇÃO DE ROTAÇÃO =====
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* ===== TEXTO DE CARREGAMENTO ===== */}
        <p className="mt-4 text-gray-600 font-medium">Carregando...</p>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
