import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks'
import { logout } from '../../../core/store/slices/authSlice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success('Logout realizado com sucesso')
      navigate('/login')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <motion.nav
      className="bg-primary-600 text-white shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4 max-w-4xl flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Login App
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline">Olá, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-white text-primary-600 rounded-md hover:bg-gray-100 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-gray-200 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 text-sm bg-white text-primary-600 rounded-md hover:bg-gray-100 transition duration-200"
              >
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
