import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, apiClient } from '@core'
import type {
  User,
  LoginCredentials,
  CompleteRegisterData,
  AuthResponse,
  MessageResponse
} from '../types/auth.types'

// ========== CLASSE DO SERVIÇO DE AUTENTICAÇÃO ==========
class AuthService {
  // ========== INICIAR REGISTRO (APENAS EMAIL) ==========
  async startRegister(email: string): Promise<MessageResponse> {
    const response = await apiClient.post('/auth/start-register', { email })
    return response.data
  }

  // ========== COMPLETAR REGISTRO (NOME E SENHA) ==========
  async completeRegister(
    token: string,
    userData: CompleteRegisterData
  ): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      `/auth/complete-register/${token}`,
      userData
    )
    return response.data.user
  }

  // ========== LOGIN COM EMAIL/SENHA ==========
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    )
    return response.data.user
  }

  // ========== LOGIN COM GOOGLE ==========
  async googleLogin(idToken: string): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/google', {
      idToken
    })
    return response.data.user
  }

  // ========== INÍCIO DO LOGIN COM GOOGLE (FRONTEND) ==========
  async initiateGoogleLogin(): Promise<string> {
    const provider = new GoogleAuthProvider()

    // Adiciona escopos específicos
    provider.addScope('profile')
    provider.addScope('email')

    const result = await signInWithPopup(auth, provider)
    const user = result.user

    if (!user) {
      throw new Error('Não foi possível autenticar com o Google')
    }

    const idToken = await user.getIdToken()
    return idToken
  }

  // ========== ESQUECI A SENHA ==========
  async forgotPassword(email: string): Promise<MessageResponse> {
    const response = await apiClient.post('/auth/forgot-password', { email })
    return response.data
  }

  // ========== REDEFINIR SENHA ==========
  async resetPassword(
    token: string,
    password: string
  ): Promise<MessageResponse> {
    const response = await apiClient.put(`/auth/reset-password/${token}`, {
      password
    })
    return response.data
  }

  // ========== OBTER USUÁRIO ATUAL ==========
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<AuthResponse>('/auth/me')
    return response.data.user
  }

  // ========== LOGOUT ==========
  async logout(): Promise<MessageResponse> {
    // Logout do Firebase se necessário
    if (auth.currentUser) {
      await auth.signOut()
    }

    // Logout do backend
    const response = await apiClient.get('/auth/logout')
    return response.data
  }
}

// ========== INSTÂNCIA SINGLETON ==========
const authService = new AuthService()

export default authService
export { authService }
