import React from 'react'
import { useAppSelector } from '@core/store/hooks'
import { motion } from 'framer-motion'

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        variants={itemVariants}
      >
        <motion.h2 className="text-2xl font-bold mb-6" variants={itemVariants}>
          Dashboard
        </motion.h2>

        <motion.div
          className="bg-blue-50 p-4 rounded-lg mb-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Bem-vindo(a), {user?.name}!
          </h3>
          <p className="text-blue-600">Seu email: {user?.email}</p>
        </motion.div>

        <motion.p className="text-gray-600 mb-6" variants={itemVariants}>
          Esta é a área protegida da aplicação. Você só tem acesso a esta página
          porque está autenticado e seu email foi verificado.
        </motion.p>

        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Status da Conta</h4>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-green-600">Ativa</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <div className="bg-white rounded-lg shadow-md p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            Funcionalidades Implementadas
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
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
                className="w-5 h-5 text-green-500 mr-2"
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
                className="w-5 h-5 text-green-500 mr-2"
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
                className="w-5 h-5 text-green-500 mr-2"
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
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Próximos Passos
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-purple-500 mr-2"
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
                className="w-5 h-5 text-purple-500 mr-2"
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
                className="w-5 h-5 text-purple-500 mr-2"
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
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
