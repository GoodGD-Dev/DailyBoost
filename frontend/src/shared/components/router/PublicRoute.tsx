import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@core/store/hooks'

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  // Se ainda estiver carregando, não redireciona
  if (loading) return null

  // Se estiver autenticado, redireciona para dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default PublicRoute
