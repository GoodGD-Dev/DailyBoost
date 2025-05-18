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
import Dashboard from '@pages/Dashboard'
import NotFound from '@pages/NotFound'

// Components
import ProtectedRoute from '@shared/components/router/ProtectedRoute'
import PublicRoute from '@shared/components/router/PublicRoute'
import Layout from '@features/Auth/components/Layout'

// Route
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public Routes
      {
        element: <PublicRoute />,
        children: [
          { index: true, element: <Navigate to="/login" replace /> },
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password/:token', element: <ResetPassword /> },
          { path: 'verify-email/:token', element: <VerifyEmail /> }
        ]
      },
      // Private Routes
      {
        element: <ProtectedRoute />,
        children: [{ path: 'dashboard', element: <Dashboard /> }]
      },
      // Rota 404
      { path: '*', element: <NotFound /> }
    ]
  }
]

//RouterApp

const Router: React.FC = () => {
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

export default Router
