import React from 'react'
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  Navigate
} from 'react-router-dom'

// Pages
import Login from '@pages/Auth/Login'
import Register from '@pages/Auth/Register'
import ForgotPassword from '@pages/Auth/ForgotPassword'
import ResetPassword from '@pages/Auth/ResetPassword'
import VerifyEmail from '@pages/Auth/VerifyEmail'
import EmailVerificationRequired from '@pages/Auth/EmailVerificationRequired'
import Logout from '@pages/Auth/Logout'
import Dashboard from '@pages/Dashboard'
import NotFound from '@pages/NotFound'

// Access Control
import ProtectedRoute from '@shared/components/router/ProtectedRoute'
import PublicRoute from '@shared/components/router/PublicRoute'
import VerifyRequiredRoute from '@shared/components/router/VerifyRequiredRoute'
import Layout from '@features/Auth/components/Layout'

// Routes
const routes: RouteObject[] = [
  {
    // Rota raiz que engloba toda a aplicação
    path: '/',
    element: <Layout />, // Layout base que será mostrado em todas as páginas
    children: [
      // Public Routes
      {
        element: <PublicRoute />, // Componente que verifica se o usuário não está logado
        children: [
          // Rota inicial - redireciona automaticamente para /login
          { index: true, element: <Navigate to="/login" replace /> },

          // Páginas de autenticação
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password/:token', element: <ResetPassword /> },
          { path: 'verify-email/:token', element: <VerifyEmail /> },
          { path: 'logout', element: <Logout /> }
        ]
      },

      // ROTA PARA VERIFICAÇÃO DE EMAIL - Para usuários logados mas com email não verificado
      {
        element: <VerifyRequiredRoute />, // Componente que verifica se o email precisa ser verificado
        children: [
          { path: 'verify-required', element: <EmailVerificationRequired /> }
        ]
      },

      // ROTAS PRIVADAS - Acessíveis apenas para usuários logados E com email verificado
      {
        element: <ProtectedRoute />, // Componente que verifica se o usuário está logado e verificado
        children: [{ path: 'dashboard', element: <Dashboard /> }] // /dashboard - página principal do app
      },
      // ROTA 404 - Captura qualquer URL que não foi definida acima
      { path: '*', element: <NotFound /> } // Qualquer rota não encontrada mostra página 404
    ]
  }
]
//RouterApp
const Router: React.FC = () => {
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}
export default Router
