import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@core/store/hooks'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { resendVerificationEmail } from '@core/store/slices/authSlice'

const EmailVerificationRequired: React.FC = () => {
  // ========== HOOKS E ESTADO ==========

  // Hook para disparar ações do Redux
  const dispatch = useAppDispatch()

  // Hook para ler dados do estado Redux
  // Pega os dados do usuário e status de carregamento do slice de auth
  const { user, loading } = useAppSelector((state) => state.auth)

  // Estado local para controlar se o email já foi reenviado
  // Evita que o usuário clique várias vezes no botão
  const [resendEmailSent, setResendEmailSent] = useState(false)

  // ========== CONFIGURAÇÕES DE ANIMAÇÃO ==========

  // Animação do container principal - aparece gradualmente
  const containerVariants = {
    hidden: { opacity: 0 }, // Estado inicial: invisível
    visible: {
      opacity: 1, // Estado final: visível
      transition: {
        staggerChildren: 0.1 // Cada elemento filho aparece com 0.1s de atraso
      }
    }
  }

  // Animação dos elementos filhos - deslizam de baixo para cima
  const itemVariants = {
    hidden: { y: 20, opacity: 0 }, // Estado inicial: 20px abaixo e invisível
    visible: {
      y: 0, // Estado final: posição original
      opacity: 1, // e visível
      transition: {
        duration: 0.4 // Animação dura 0.4 segundos
      }
    }
  }

  // ========== FUNÇÃO PARA REENVIAR EMAIL ==========
  const handleResendEmail = async () => {
    // Verifica se existe um email do usuário
    if (!user?.email) return

    try {
      // Dispara a ação do Redux para reenviar o email
      // .unwrap() converte a Promise do Redux em uma Promise normal
      await dispatch(resendVerificationEmail(user.email)).unwrap()
      // Se deu certo, marca que o email foi enviado
      setResendEmailSent(true)

      // Mostra notificação de sucesso
      toast.success('Email de verificação reenviado com sucesso!')
    } catch (error) {
      // Se deu erro, mostra notificação de erro
      toast.error('Erro ao reenviar o email de verificação. Tente novamente.')
    }
  }

  // ========== RENDER DO COMPONENTE ==========
  return (
    <motion.div
      className="max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Card principal */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        variants={itemVariants}
      >
        {/* Título da página */}
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          variants={itemVariants}
        >
          Verificação de Email Necessária
        </motion.h2>

        <motion.div variants={itemVariants}>
          {/* Caixa de aviso com informações principais */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="mb-2">
              <strong>Olá {user?.name}!</strong>
            </p>
            <p>
              Para sua segurança, precisamos verificar seu endereço de email
              antes de continuar.
            </p>
            <p className="mt-2">
              Verifique sua caixa de entrada em <strong>{user?.email}</strong> e
              clique no link de confirmação.
            </p>
          </div>

          {/* RENDERIZAÇÃO CONDICIONAL - Mostra mensagem diferente se email foi reenviado */}
          {resendEmailSent ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              <p>Email de verificação reenviado com sucesso!</p>
              <p className="mt-2">
                Por favor, verifique sua caixa de entrada e spam.
              </p>
            </div>
          ) : (
            // Se ainda não foi reenviado, mostra botão para reenviar
            <motion.div className="mb-6 text-center" variants={itemVariants}>
              <p className="mb-4 text-gray-600">
                Não recebeu o email ou o link expirou?
              </p>

              {/* Botão para reenviar email */}
              <button
                onClick={handleResendEmail}
                disabled={loading}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
                  ${
                    loading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {/* RENDERIZAÇÃO CONDICIONAL - Mostra spinner ou texto */}
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      {/* Círculo do spinner */}
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      {/* Parte que gira do spinner */}
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </div>
                ) : (
                  // Estado normal: mostra texto do botão
                  'Reenviar Email de Verificação'
                )}
              </button>
            </motion.div>
          )}

          {/* Link para fazer logout e usar outra conta */}
          <motion.div
            className="text-center text-sm mt-6"
            variants={itemVariants}
          >
            <Link to="/logout" className="text-blue-600 hover:text-blue-700">
              Sair e usar outra conta
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default EmailVerificationRequired
