import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@core'

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  // Se ainda estiver carregando, não redireciona
  if (loading) return null

  // Se estiver autenticado , redireciona para dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Se não estiver autenticado, permite acesso à rota pública
  return <Outlet />
}

export default PublicRoute
