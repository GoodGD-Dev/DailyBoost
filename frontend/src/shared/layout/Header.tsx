import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppSelector } from '@core'
import { useLogout } from '@features'

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { handleLogout, isLoading } = useLogout()

  // ========== RENDER ==========
  return (
    <motion.nav
      className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50 shadow-sm"
      // ========== ANIMAÇÃO DE ENTRADA ==========
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-indigo-600 font-bold text-xl tracking-tight"
          >
            DailyBoost
          </Link>

          {/* ========== MENU DESKTOP ========== */}
          <div className="hidden md:flex items-center space-x-6">
            {/* RENDERIZAÇÃO CONDICIONAL - Baseada no estado de autenticação */}
            {isAuthenticated ? (
              // ========== USUÁRIO LOGADO ==========
              <>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-2">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Nome do usuário */}
                  <span className="text-gray-700 font-medium">
                    {user?.name}
                  </span>
                </div>

                {/* ========== BOTÃO DE LOGOUT ========== */}
                <button
                  onClick={() => handleLogout()} //
                  disabled={isLoading} //
                  className={`
                    bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isLoading
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:bg-indigo-50'
                    }
                  `}
                >
                  {isLoading ? 'Saindo...' : 'Sair'}{' '}
                </button>
              </>
            ) : (
              // ========== USUÁRIO NÃO LOGADO ==========
              <>
                <Link
                  to="/login"
                  className="text-gray-600 font-medium hover:text-indigo-600 transition-colors duration-200"
                >
                  Login
                </Link>

                {/* Botão de registro */}
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>

          {/* ========== BOTÃO HAMBÚRGUER (MOBILE) ========== */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* RENDERIZAÇÃO CONDICIONAL - Ícone hambúrguer ou X */}
              {isMenuOpen ? (
                // Ícone X (fechar)
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Ícone hambúrguer (3 linhas)
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* ========== MENU MOBILE ========== */}
        {/* RENDERIZAÇÃO CONDICIONAL - Só aparece se isMenuOpen for true */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 py-4 border-t border-gray-100"
            // ========== ANIMAÇÃO DO MENU MOBILE ==========
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            {/* RENDERIZAÇÃO CONDICIONAL - Mesmo esquema do menu desktop */}
            {isAuthenticated ? (
              // ========== USUÁRIO LOGADO (MOBILE) ==========
              <div className="flex flex-col space-y-4">
                <div className="flex items-center py-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-2">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.name}
                  </span>
                </div>

                {/* ========== BOTÃO DE LOGOUT MOBILE CORRIGIDO ========== */}
                <button
                  onClick={() => handleLogout()} // ✅ CORRETO: Chama a função do hook
                  disabled={isLoading} // ✅ BONUS: Estado de loading
                  className={`
                    bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 w-full text-left
                    ${
                      isLoading
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:bg-indigo-50'
                    }
                  `}
                >
                  {isLoading ? 'Saindo...' : 'Sair'}{' '}
                  {/* ✅ BONUS: Feedback visual */}
                </button>
              </div>
            ) : (
              // ========== USUÁRIO NÃO LOGADO (MOBILE) ==========
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="block py-2 text-gray-600 font-medium hover:text-indigo-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 text-center"
                >
                  Registrar
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Header
