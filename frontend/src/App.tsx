import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './core/store/hooks'
import { loadUser } from './core/store/slices/authSlice'
import { AnimatePresence } from 'framer-motion'

// Páginas
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

// Componentes
import ProtectedRoute from './features/Auth/components/ProtectedRoute'
import PublicRoute from './features/Auth/components/PublicRoute'
import Layout from './features/Auth/components/Layout'
import LoadingScreen from './features/Auth/components/LoadingScreen'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { loading: authLoading } = useAppSelector((state) => state.auth)

  // Verifica se o usuário já está autenticado (token JWT) ao carregar a aplicação
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  // Mostra loading enquanto verifica o estado de autenticação
  if (authLoading) {
    return <LoadingScreen />
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          {/* Rotas Públicas - acessíveis apenas quando deslogado */}
          <Route element={<PublicRoute />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="verify-email/:token" element={<VerifyEmail />} />
          </Route>

          {/* Rotas Protegidas - acessíveis apenas quando logado */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            {/* Adicione outras rotas protegidas aqui */}
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
