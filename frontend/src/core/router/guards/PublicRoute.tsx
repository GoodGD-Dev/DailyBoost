import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@core'

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  )

  // Se ainda estiver carregando, não redireciona
  if (loading) return null

  // Se estiver autenticado e email verificado, redireciona para dashboard
  if (isAuthenticated && user?.isEmailVerified) {
    return <Navigate to="/dashboard" replace />
  }

  // Se estiver autenticado mas email não verificado, redireciona para página de verificação
  if (isAuthenticated && user && !user.isEmailVerified) {
    return <Navigate to="/verify-required" replace />
  }

  // Se não estiver autenticado, permite acesso à rota pública
  return <Outlet />
}

export default PublicRoute
