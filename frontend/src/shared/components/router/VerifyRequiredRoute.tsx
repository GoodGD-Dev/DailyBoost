import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@core/store/hooks'

const VerifyRequiredRoute: React.FC = () => {
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  )

  // Se ainda estiver carregando, não redireciona
  if (loading) return null

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Se estiver autenticado e email já verificado, redireciona para dashboard
  if (user?.isEmailVerified) {
    return <Navigate to="/dashboard" replace />
  }

  // Se estiver autenticado mas email não verificado, permite acesso à página de verificação
  return <Outlet />
}

export default VerifyRequiredRoute
