// Tipos específicos da feature de autenticação
export interface User {
  id: string
  name: string
  email: string
  isEmailVerified: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CompleteRegisterData {
  name: string
  password: string
}

// Tipos de resposta específicos do auth
export interface AuthResponse {
  success: boolean
  user: User
  message: string
}

export interface MessageResponse {
  success: boolean
  message: string
}
