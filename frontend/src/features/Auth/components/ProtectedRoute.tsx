import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../../core/store/hooks'

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  // Se ainda estiver carregando, não redireciona
  if (loading) return null

  // Se não estiver autenticado, redireciona para login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
