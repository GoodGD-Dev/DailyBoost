import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@core/store/hooks'
import { logout } from '@core/store/slices/authSlice'
import { toast } from 'react-toastify'

const Logout: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // ========== EFFECT PRINCIPAL - EXECUTA LOGOUT ==========
  useEffect(() => {
    // Função assíncrona interna para executar o logout
    const performLogout = async () => {
      try {
        // ========== TENTATIVA DE LOGOUT ==========
        await dispatch(logout()).unwrap()

        // Se deu certo, mostra notificação de sucesso
        toast.success('Logout realizado com sucesso')

        navigate('/login')
        // Redireciona para página de login
      } catch (error) {
        // ========== TRATAMENTO DE ERRO ==========
        // Se der erro no logout (problema de rede, servidor, etc.)
        toast.error('Erro ao realizar logout')
        navigate('/login')
      }
    }

    // Executa a função de logout imediatamente
    performLogout()
  }, [dispatch, navigate])

  // ========== RENDER - TELA DE CARREGAMENTO ==========
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {/* ========== SPINNER DE CARREGAMENTO ========== */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Saindo...</p>
      </div>
    </div>
  )
}

export default Logout
