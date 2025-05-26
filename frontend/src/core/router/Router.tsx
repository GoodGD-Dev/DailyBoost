import React from 'react'
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  Navigate
} from 'react-router-dom'

// Pages
import {
  Dashboard,
  ForgotPassword,
  Login,
  NotFound,
  Register,
  CompleteRegister,
  ResetPassword,
  VerifyEmail,
  VerifyRequired
} from '@pages'

// Access Control
import { ProtectedRoute, PublicRoute, VerifyRequiredRoute } from '@core'
import { MainLayout } from '@shared'

// Routes
const routes: RouteObject[] = [
  {
    // Rota raiz que engloba toda a aplicação
    path: '/',
    element: <MainLayout />, // Layout base que será mostrado em todas as páginas
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
          { path: 'complete-register/:token', element: <CompleteRegister /> }, // NOVA ROTA
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password/:token', element: <ResetPassword /> },
          { path: 'verify-email/:token', element: <VerifyEmail /> }
        ]
      },

      // ROTA PARA VERIFICAÇÃO DE EMAIL - Para usuários logados mas com email não verificado
      {
        element: <VerifyRequiredRoute />, // Componente que verifica se o email precisa ser verificado
        children: [{ path: 'verify-required', element: <VerifyRequired /> }]
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
