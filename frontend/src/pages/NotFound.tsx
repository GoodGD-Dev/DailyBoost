import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFound: React.FC = () => {
  return (
    <motion.div
      className="max-w-md mx-auto text-center"
      // ===== CONFIGURAÇÕES DE ANIMAÇÃO =====
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Card principal da página 404 */}
      <div className="theme-card p-8">
        {/* ===== NÚMERO 404 GRANDE ===== */}
        <h2 className="text-6xl font-bold theme-text-gray-800 mb-4">404</h2>

        {/* ===== TÍTULO EXPLICATIVO ===== */}
        <h3 className="text-xl font-medium theme-text-gray-700 mb-6">
          Página Não Encontrada
        </h3>

        {/* ===== MENSAGEM DESCRITIVA ===== */}
        <p className="theme-text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        {/* ===== BOTÃO DE RETORNO ===== */}
        <Link
          to="/"
          className="inline-block px-6 py-3 theme-bg-primary-600 theme-text-white rounded-md font-medium hover:theme-bg-primary-700 transition-colors duration-200"
        >
          Voltar para Home
        </Link>
      </div>
    </motion.div>
  )
}

export default NotFound
