import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@core'

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  // Se ainda estiver carregando, não redireciona
  if (loading) return null

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Se estiver autenticado, permite acesso à rota protegida
  return <Outlet />
}

export default PrivateRoute
