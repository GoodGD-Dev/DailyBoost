import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@core'
import { auth, googleLogin, FirebaseError } from '@auth'

const GoogleButton: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  // ========== FUNÇÃO PRINCIPAL DE LOGIN ==========
  const handleGoogleLogin = async () => {
    try {
      console.log('Iniciando login com Google...')
      setLoading(true)

      // ========== CONFIGURAÇÃO DO PROVEDOR GOOGLE ==========
      console.log('Criando provedor Google...')
      const provider = new GoogleAuthProvider()

      // Adiciona escopos específicos para garantir acesso aos dados necessários
      provider.addScope('profile')
      provider.addScope('email')

      console.log('Abrindo popup de autenticação...')
      console.log('Auth object:', auth)

      try {
        // ========== AUTENTICAÇÃO VIA POPUP ==========
        // signInWithPopup abre uma janela popup com a tela de login do Google
        const result = await signInWithPopup(auth, provider)
        console.log('Popup concluído com sucesso, resultado:', result)

        // Extrai os dados do usuário do resultado
        const user = result.user
        console.log('Usuário autenticado:', user)

        // Validação de segurança
        if (!user) {
          throw new Error('Não foi possível autenticar com o Google')
        }

        // ========== OBTENÇÃO DO TOKEN JWT ==========
        console.log('Obtendo ID token...')
        // getIdToken() pega o token JWT que será enviado para o backend
        const idToken = await user.getIdToken()
        console.log(
          'ID token obtido, primeiros caracteres:',
          idToken.substring(0, 10) + '...'
        )

        // ========== ENVIO PARA O BACKEND ==========
        console.log('Enviando token para backend...')
        // Dispara a ação Redux que envia o token para a API
        // .unwrap() converte a Promise do Redux em Promise normal
        await dispatch(googleLogin(idToken)).unwrap()

        // Mostra notificação de sucesso
        toast.success('Login com Google realizado com sucesso')
      } catch (popupError) {
        // ========== TRATAMENTO DE ERROS DO POPUP ==========
        const firebaseError = popupError as FirebaseError
        console.error('Erro no popup:', firebaseError)
        console.error('Código do erro:', firebaseError.code)
        console.error('Mensagem do erro:', firebaseError.message)

        // Tratamento específico para erro de configuração
        if (firebaseError.code === 'auth/configuration-not-found') {
          toast.error(
            'Erro na configuração do Firebase. Verifique o console para mais detalhes.'
          )
        } else if (firebaseError.code === 'auth/popup-closed-by-user') {
          // Usuário fechou o popup - não mostra erro
          console.log('Popup fechado pelo usuário')
        } else if (firebaseError.code === 'auth/cancelled-popup-request') {
          // Popup cancelado - não mostra erro
          console.log('Popup cancelado')
        } else {
          // Outros erros do popup (erro de rede, etc.)
          toast.error(
            firebaseError.message || 'Erro ao abrir popup de autenticação'
          )
        }
      }
    } catch (error) {
      // ========== TRATAMENTO DE ERROS GERAIS ==========
      console.error('Erro geral:', error)

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao fazer login com Google'

      toast.error(errorMessage)
    } finally {
      // ========== LIMPEZA ==========
      // Sempre executa, independente de sucesso ou erro
      setLoading(false)
    }
  }

  // ========== RENDER DO COMPONENTE ==========
  return (
    <motion.button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`
        w-full flex justify-center items-center
        theme-bg-white theme-border-gray-300 border rounded-md py-2 px-4
        theme-text-gray-700 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        ${
          loading
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:theme-bg-gray-50 hover:theme-border-gray-400'
        }
      `}
      // ========== ANIMAÇÕES FRAMER MOTION ==========
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
    >
      {/* ========== CONTEÚDO DO BOTÃO ========== */}
      {/* RENDERIZAÇÃO CONDICIONAL - Spinner ou ícone do Google */}
      {loading ? (
        // ========== SPINNER DE CARREGAMENTO ==========
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 theme-text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          {/* Círculo base do spinner */}
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          {/* Parte que cria o efeito de rotação */}
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        // ========== ÍCONE DO GOOGLE ==========
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
          <path fill="none" d="M1 1h22v22H1z" />
        </svg>
      )}
      {/* Texto do botão - sempre visível */}
      <span className="theme-text-gray-700">Continuar com Google</span>
    </motion.button>
  )
}

export default GoogleButton
