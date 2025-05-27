import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@core'
import { clearError, formVariants, verifyEmail } from '@features'

// Interface para definir o tipo de erro
interface ApiError {
  message?: string
  [key: string]: unknown
}

const VerifyEmail: React.FC = () => {
  // ========== HOOKS ==========
  const { token } = useParams<{ token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  )

  // ========== ESTADOS LOCAIS COMPLEXOS ==========
  const [verified, setVerified] = useState(false)
  const [verificationAttempted, setVerificationAttempted] = useState(false)
  const [verificationInProgress, setVerificationInProgress] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  // ========== EFFECT PARA TRATAMENTO DE ERROS ==========
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // ========== EFFECT PARA REDIRECIONAMENTO APÓS VERIFICAÇÃO ==========
  // Monitora se verificação foi bem-sucedida e usuário está autenticado
  useEffect(() => {
    if (verified && isAuthenticated && !redirecting) {
      setRedirecting(true)
      toast.success('Login realizado automaticamente!')

      // ========== REDIRECIONAMENTO COM DELAY ==========
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    }
  }, [verified, isAuthenticated, navigate, redirecting])

  // ========== EFFECT PRINCIPAL - VERIFICAÇÃO AUTOMÁTICA ==========
  // Executa verificação assim que componente é montado
  useEffect(() => {
    // Verificar se temos um token válido e se já não estamos processando ou não tentamos ainda
    if (token && !verificationAttempted && !verificationInProgress) {
      // Função assíncrona interna para executar verificação
      const verify = async () => {
        try {
          // ========== INÍCIO DA VERIFICAÇÃO ==========
          setVerificationInProgress(true)
          console.log('Iniciando verificação com token:', token)

          // ========== DISPATCH DA VERIFICAÇÃO ==========
          // Verificar o email (e fazer login automaticamente)
          await dispatch(verifyEmail(token)).unwrap()
          console.log('Verificação bem-sucedida')

          // ========== MARCAÇÃO DE SUCESSO ==========
          setVerified(true)
          toast.success('Email verificado com sucesso!')

          // ========== LIMPEZA DA URL ==========
          // Limpar o token da URL após a verificação
          if (window.history.replaceState) {
            const newUrl = window.location.pathname.replace(
              `/verify-email/${token}`,
              '/verify-email'
            )
            // Atualiza URL no browser sem recarregar página
            window.history.replaceState({}, document.title, newUrl)
          }
        } catch (error: unknown) {
          // ========== TRATAMENTO DE ERRO ==========
          console.error('Erro na verificação:', error)
        } finally {
          // ========== LIMPEZA SEMPRE EXECUTADA ==========
          setVerificationAttempted(true)
          setVerificationInProgress(false)
        }
      }

      verify()
    }
  }, [token, dispatch, verificationAttempted, verificationInProgress])

  // ========== RENDER CONDICIONAL - LOADING STATES ==========
  // Estado 1: Verificação em progresso
  if (loading || verificationInProgress) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="flex flex-col justify-center items-center h-40">
            {/* Spinner de carregamento */}
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Verificando email...</p>
          </div>
        </div>
      </div>
    )
  }

  // Estado 2: Redirecionando
  if (redirecting) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="flex flex-col justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Redirecionando para o dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // ========== RENDER PRINCIPAL - RESULTADO DA VERIFICAÇÃO ==========
  return (
    <motion.div
      className="max-w-md mx-auto"
      variants={formVariants.container}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="card" variants={formVariants.item}>
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          variants={formVariants.item}
        >
          Verificação de Email
        </motion.h2>

        {/* RENDERIZAÇÃO CONDICIONAL - Sucesso vs Erro */}
        {verified ? (
          // ========== ESTADO: VERIFICAÇÃO BEM-SUCEDIDA ==========
          <motion.div variants={formVariants.item}>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {/* Ícone de check (✓) */}
              <svg
                className="w-6 h-6 inline-block mr-2"
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
              Seu email foi verificado com sucesso! Redirecionando para o
              dashboard...
            </div>
            {/* Botão manual para ir ao dashboard */}
            <div className="text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary inline-block"
              >
                Ir para o Dashboard agora
              </button>
            </div>
          </motion.div>
        ) : (
          // ========== ESTADO: VERIFICAÇÃO FALHOU ==========
          <motion.div variants={formVariants.item}>
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <svg
                className="w-6 h-6 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>

              {/* Mensagem de erro dinâmica */}
              {error ||
                'Não foi possível verificar seu email. O link pode ter expirado ou ser inválido.'}
            </div>

            {/* Link para voltar ao login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700"
              >
                Voltar para o login
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default VerifyEmail
