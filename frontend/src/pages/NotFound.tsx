import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFound: React.FC = () => {
  return (
    <motion.div
      className="max-w-md mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-6xl font-bold text-gray-800 mb-4">404</h2>
        <h3 className="text-xl font-medium text-gray-700 mb-6">
          Página Não Encontrada
        </h3>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Voltar para Home
        </Link>
      </div>
    </motion.div>
  )
}

export default NotFound
