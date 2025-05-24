import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@core/store/hooks'

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  )

  // Se ainda estiver carregando, não redireciona
  if (loading) return null

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Se estiver autenticado mas o email não estiver verificado, redireciona para a página de verificação
  if (user && !user.isEmailVerified) {
    return <Navigate to="/verify-required" replace />
  }

  // Se estiver autenticado e email verificado, permite acesso à rota protegida
  return <Outlet />
}

export default ProtectedRoute
