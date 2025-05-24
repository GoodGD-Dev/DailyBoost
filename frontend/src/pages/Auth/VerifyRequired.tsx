import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { resendVerificationEmail, useAppSelector, useAppDispatch } from '@core'
import { useLogout, formVariants } from '@features'

// ========== COMPONENTES REUTILIZÁVEIS ==========
import AuthForm from '@/features/Auth/layout/AuthLayout'
import StatusMessage from '@shared/ui/StatusMessage'

const VerifyRequired: React.FC = () => {
  // ========== HOOKS E ESTADO ==========
  const dispatch = useAppDispatch()
  const { user, loading } = useAppSelector((state) => state.auth)
  const [resendEmailSent, setResendEmailSent] = useState(false)
  const { handleLogout, isLoading } = useLogout()

  // ========== FUNÇÃO PARA REENVIAR EMAIL ==========
  const handleResendEmail = async () => {
    if (!user?.email) return

    try {
      await dispatch(resendVerificationEmail(user.email)).unwrap()
      setResendEmailSent(true)
      toast.success('Email de verificação reenviado com sucesso!')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Erro ao reenviar o email de verificação. Tente novamente.'

      toast.error(errorMessage)
    }
  }

  // ========== RENDER DO COMPONENTE ==========
  return (
    <AuthForm title="Verificação de Email Necessária">
      <motion.div variants={formVariants.item}>
        {/* ========== MENSAGEM PRINCIPAL ========== */}
        <StatusMessage
          type="warning"
          title={`Olá ${user?.name}!`}
          message={`Para sua segurança, precisamos verificar seu endereço de email antes de continuar. Verifique sua caixa de entrada em ${user?.email} e clique no link de confirmação.`}
        />

        {/* ========== RENDERIZAÇÃO CONDICIONAL ========== */}
        {resendEmailSent ? (
          <StatusMessage
            type="success"
            message="Email de verificação reenviado com sucesso! Por favor, verifique sua caixa de entrada e spam."
          />
        ) : (
          <motion.div className="mb-6 text-center" variants={formVariants.item}>
            <p className="mb-4 text-gray-600">
              Não recebeu o email ou o link expirou?
            </p>

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
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </div>
              ) : (
                'Reenviar Email de Verificação'
              )}
            </button>
          </motion.div>
        )}

        {/* ========== BOTÃO DE LOGOUT ========== */}
        <motion.div
          className="text-center text-sm mt-6"
          variants={formVariants.item}
        >
          <button
            onClick={() => handleLogout()}
            disabled={isLoading}
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
            {isLoading ? 'Saindo...' : 'Sair'}
          </button>
        </motion.div>
      </motion.div>
    </AuthForm>
  )
}

export default VerifyRequired
