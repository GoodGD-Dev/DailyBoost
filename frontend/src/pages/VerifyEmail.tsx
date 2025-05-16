import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../core/store/hooks'
import { verifyEmail, clearError } from '../core/store/slices/authSlice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  )
  const [verified, setVerified] = useState(false)
  const [verificationAttempted, setVerificationAttempted] = useState(false)
  const [verificationInProgress, setVerificationInProgress] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  // Exibir erro no toast, se houver
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Redirecionar se o usuário estiver autenticado após verificação
  useEffect(() => {
    if (verified && isAuthenticated && !redirecting) {
      setRedirecting(true)
      toast.success('Login realizado automaticamente!')

      // Redirecionar para o dashboard após um breve atraso
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    }
  }, [verified, isAuthenticated, navigate, redirecting])

  // Verificar o email automaticamente quando o componente for montado
  useEffect(() => {
    // Verificar se temos um token válido e se já não estamos processando ou não tentamos ainda
    if (token && !verificationAttempted && !verificationInProgress) {
      const verify = async () => {
        try {
          setVerificationInProgress(true)
          console.log('Iniciando verificação com token:', token)

          // Verificar o email (e fazer login automaticamente)
          await dispatch(verifyEmail(token)).unwrap()
          console.log('Verificação bem-sucedida')
          setVerified(true)
          toast.success('Email verificado com sucesso!')

          // ADICIONE AQUI: Limpar o token da URL após a verificação
          if (window.history.replaceState) {
            const newUrl = window.location.pathname.replace(
              `/verify-email/${token}`,
              '/verify-email'
            )
            window.history.replaceState({}, document.title, newUrl)
          }
        } catch (error: any) {
          console.error('Erro na verificação:', error)
          // Erro já tratado no useEffect acima
        } finally {
          setVerificationAttempted(true)
          setVerificationInProgress(false)
        }
      }

      verify()
    }
  }, [token, dispatch, verificationAttempted, verificationInProgress])

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

  // Mostrar carregamento enquanto a verificação está em progresso
  if (loading || verificationInProgress) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="flex flex-col justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Verificando email...</p>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar página de redirecionamento
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

  return (
    <motion.div
      className="max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="card" variants={itemVariants}>
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          variants={itemVariants}
        >
          Verificação de Email
        </motion.h2>

        {verified ? (
          <motion.div variants={itemVariants}>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
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
          <motion.div variants={itemVariants}>
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
              {error ||
                'Não foi possível verificar seu email. O link pode ter expirado ou ser inválido.'}
            </div>
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
