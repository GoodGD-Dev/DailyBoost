import React from 'react'
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  Navigate
} from 'react-router-dom'

// Pages
import {
  ForgotPassword,
  Login,
  Register,
  CompleteRegister,
  ResetPassword
} from '@auth'

import { Dashboard, NotFound } from '@pages'

// Access Control
import { PrivateRoute, PublicRoute } from '@auth'

// Layout
import { MainLayout } from '@shared'

// ========== CONFIGURAÇÃO DAS ROTAS ==========
const routes: RouteObject[] = [
  {
    // Rota raiz que engloba toda a aplicação
    path: '/',
    element: <MainLayout />, // Layout base que será mostrado em todas as páginas
    children: [
      // ========== ROTAS PÚBLICAS ==========
      {
        element: <PublicRoute />, // Componente que verifica se o usuário não está logado
        children: [
          // Rota inicial - redireciona automaticamente para /login
          { index: true, element: <Navigate to="/login" replace /> },
          // Páginas de autenticação
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'complete-register/:token', element: <CompleteRegister /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password/:token', element: <ResetPassword /> }
        ]
      },

      // ========== ROTAS PRIVADAS ==========
      // Acessíveis apenas para usuários logados E com email verificado
      {
        element: <PrivateRoute />, // Componente que verifica se o usuário está logado e verificado
        children: [
          { path: 'dashboard', element: <Dashboard /> } // /dashboard - página principal do app
        ]
      },

      // ========== ROTA 404 ==========
      // Captura qualquer URL que não foi definida acima
      { path: '*', element: <NotFound /> } // Qualquer rota não encontrada mostra página 404
    ]
  }
]

// ========== COMPONENTE ROUTER ==========
const Router: React.FC = () => {
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export default Router
