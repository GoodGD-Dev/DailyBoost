import React from 'react'
import { motion } from 'framer-motion'
import { useAppSelector } from '@core'
import { formVariants } from '@shared'

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <motion.div
      variants={formVariants.container}
      initial="hidden"
      animate="visible"
    >
      {/* ===== SEÇÃO PRINCIPAL DO DASHBOARD ===== */}
      <motion.div className="theme-card p-6" variants={formVariants.item}>
        {/* Título da página */}
        <motion.h2
          className="text-2xl font-bold mb-6 theme-text-gray-800"
          variants={formVariants.item}
        >
          Dashboard
        </motion.h2>

        {/* Card de boas-vindas com informações do usuário */}
        <motion.div
          className="theme-bg-primary-50 p-4 rounded-lg mb-6"
          variants={formVariants.item}
        >
          <h3 className="text-lg font-semibold theme-text-primary-700 mb-2">
            Bem-vindo(a), {user?.name}!
          </h3>
          <p className="theme-text-primary-600">Seu email: {user?.email}</p>
        </motion.div>

        {/* Texto explicativo sobre a área protegida */}
        <motion.p
          className="theme-text-gray-600 mb-6"
          variants={formVariants.item}
        >
          Esta é a área protegida da aplicação. Você só tem acesso a esta página
          porque está autenticado e seu email foi verificado.
        </motion.p>

        {/* Status da conta do usuário */}
        <motion.div className="space-y-4" variants={formVariants.item}>
          <div className="border theme-border-gray-200 rounded-lg p-4">
            <h4 className="font-medium theme-text-gray-700 mb-2">
              Status da Conta
            </h4>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 theme-bg-success-500 rounded-full mr-2"></span>
              <span className="theme-text-success-600">Ativa</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ===== GRID COM DOIS CARDS INFORMATIVOS ===== */}
      <motion.div
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={formVariants.item}
      >
        {/* CARD 1: Funcionalidades já implementadas */}
        <div className="theme-card p-6 bg-gradient-to-br from-primary-50 to-primary-100">
          <h3 className="text-lg font-semibold theme-text-primary-700 mb-4">
            Funcionalidades Implementadas
          </h3>
          <ul className="space-y-2 theme-text-gray-700">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 theme-text-success-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Autenticação com JWT via HTTP Cookie
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 theme-text-success-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Login com Google via Firebase Auth
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 theme-text-success-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Verificação de Email
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 theme-text-success-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Rotas Protegidas
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 theme-text-success-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Sistema de Temas Dinâmico
            </li>
          </ul>
        </div>

        {/* CARD 2: Próximos passos e melhorias futuras */}
        <div className="theme-card p-6 bg-gradient-to-br from-secondary-50 to-secondary-100">
          <h3 className="text-lg font-semibold theme-text-secondary-700 mb-4">
            Próximos Passos
          </h3>
          <ul className="space-y-2 theme-text-gray-700">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 theme-text-secondary-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              Personalizar o perfil de usuário
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 theme-text-secondary-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              Adicionar recursos adicionais
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 theme-text-secondary-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              Configurar permissões avançadas
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 theme-text-secondary-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              Modo offline e PWA
            </li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
