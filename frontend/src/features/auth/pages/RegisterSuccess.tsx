import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Mail, RefreshCw } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@core'
import { startRegister } from '@features'

const RegisterSuccess: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading } = useAppSelector((state) => state.auth)

  // Pega o email da URL
  const urlParams = new URLSearchParams(location.search)
  const email = urlParams.get('email') || 'seu email'

  console.log('🎉 RegisterSuccess render:', { email, loading })

  // ========== FUNÇÃO PARA REENVIAR EMAIL ==========
  const handleResendEmail = async () => {
    console.log('🔄 Resend email clicked for:', email)

    try {
      await dispatch(startRegister({ email })).unwrap()
      toast.success('Email reenviado com sucesso!')
    } catch (error) {
      console.log('❌ Resend email error:', error)
      toast.error('Erro ao reenviar email. Tente novamente.')
    }
  }

  // ========== FUNÇÃO PARA TENTAR NOVAMENTE ==========
  const handleTryAgain = () => {
    console.log('🔄 Try again clicked')
    navigate(`/register?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        ✅ Email Enviado!
      </h1>

      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
        <div className="flex items-center mb-2">
          <Mail className="w-5 h-5 mr-2" />
          <span className="font-medium">Email enviado com sucesso!</span>
        </div>
        <p className="mb-2">
          Enviamos um link de confirmação para <strong>{email}</strong>
        </p>
        <p className="text-sm text-green-600">
          Clique no link recebido para completar seu registro com nome e senha.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
        <p className="text-sm">
          <strong>Não recebeu o email?</strong>
        </p>
        <ul className="text-sm mt-2 space-y-1">
          <li>• Verifique sua pasta de spam</li>
          <li>• O email pode demorar alguns minutos para chegar</li>
          <li>• Certifique-se de que o email está correto</li>
        </ul>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleResendEmail}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Reenviando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Reenviar Email
            </>
          )}
        </button>

        <button
          onClick={handleTryAgain}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Tentar com outro email
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-700 text-sm"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterSuccess
