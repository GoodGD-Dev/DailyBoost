import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@core'
import { useLogout } from '@auth'

// ========== PROPS DO COMPONENTE ==========
interface UserSectionProps {
  isMobile?: boolean
  onMenuClose?: () => void // Para fechar o menu mobile após logout
}

const UserSection: React.FC<UserSectionProps> = ({
  isMobile = false,
  onMenuClose
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { handleLogout, isLoading } = useLogout()

  // ========== FUNÇÃO DE LOGOUT COM CALLBACK ==========
  const handleLogoutClick = () => {
    handleLogout()
    // Fechar menu mobile após logout (se aplicável)
    if (isMobile && onMenuClose) {
      onMenuClose()
    }
  }

  // ========== COMPONENTE DO AVATAR ==========
  const UserAvatar = () => (
    <div className="h-8 w-8 rounded-full theme-bg-primary-100 flex items-center justify-center theme-text-primary-600 font-medium mr-2">
      {user?.name?.charAt(0).toUpperCase()}
    </div>
  )

  // ========== COMPONENTE DO BOTÃO DE LOGOUT ==========
  const LogoutButton = () => (
    <button
      onClick={handleLogoutClick}
      disabled={isLoading}
      className={`
        theme-bg-white theme-text-primary-600 border theme-border-primary-200 px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${isMobile ? 'w-full text-left' : ''}
        ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:theme-bg-primary-50'}
      `}
    >
      {isLoading ? 'Saindo...' : 'Sair'}
    </button>
  )

  // ========== RENDER CONDICIONAL ==========
  if (!isAuthenticated) {
    // ========== USUÁRIO NÃO LOGADO ==========
    return (
      <div
        className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-6'}`}
      >
        <Link
          to="/login"
          className={`
            theme-text-gray-600 font-medium hover:theme-text-primary-600 transition-colors duration-200
            ${isMobile ? 'block py-2' : ''}
          `}
        >
          Login
        </Link>
        <Link
          to="/register"
          className={`
            theme-bg-primary-600 theme-text-white px-4 py-2 rounded-lg text-sm font-medium hover:theme-bg-primary-700 transition-colors duration-200
            ${isMobile ? 'text-center' : ''}
          `}
        >
          Registrar
        </Link>
      </div>
    )
  }

  // ========== USUÁRIO LOGADO ==========
  return (
    <div
      className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center space-x-6'}`}
    >
      {/* ========== INFO DO USUÁRIO ========== */}
      <div className={`flex items-center ${isMobile ? 'py-2' : ''}`}>
        <UserAvatar />
        <span className="theme-text-gray-700 font-medium">{user?.name}</span>
      </div>
      {/* ========== BOTÃO DE LOGOUT ========== */}
      <LogoutButton />
    </div>
  )
}

export default UserSection
