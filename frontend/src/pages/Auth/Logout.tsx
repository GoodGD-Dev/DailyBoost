import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@core/store/hooks'
import { logout } from '@core/store/slices/authSlice'
import { toast } from 'react-toastify'

const Logout: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(logout()).unwrap()
        toast.success('Logout realizado com sucesso')
        navigate('/login')
      } catch (error) {
        toast.error('Erro ao realizar logout')
        navigate('/login')
      }
    }

    performLogout()
  }, [dispatch, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Saindo...</p>
      </div>
    </div>
  )
}

export default Logout
