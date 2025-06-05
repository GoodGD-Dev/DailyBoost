import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch } from '@core'
import { logout } from '@auth'

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async (redirectTo = '/login') => {
    setIsLoading(true)

    try {
      // Dispara ação de logout no Redux
      // .unwrap() converte Promise Redux em Promise normal
      await dispatch(logout()).unwrap()

      // Mostra notificação de sucesso
      toast.success('Logout realizado com sucesso')

      // Redireciona para página especificada
      navigate(redirectTo)

      return true // Indica sucesso
    } catch (error) {
      // Se der erro, mostra notificação
      toast.error('Erro ao fazer logout')
      return false // Indica falha
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleLogout,
    isLoading
  }
}
