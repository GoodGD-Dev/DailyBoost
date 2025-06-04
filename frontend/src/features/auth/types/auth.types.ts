// ========== TIPOS BASE ==========
export interface User {
  id: string
  name: string
  email: string
  isEmailVerified: boolean
}

// ========== TIPOS DE FORMULÁRIO BASE ==========
type BaseFormValues = Record<string, string>

export interface LoginForm extends BaseFormValues {
  email: string
  password: string
}

export interface RegisterForm extends BaseFormValues {
  email: string
}

export interface CompleteRegisterForm extends BaseFormValues {
  name: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordForm extends BaseFormValues {
  email: string
}

export interface ResetPasswordForm extends BaseFormValues {
  password: string
  confirmPassword: string
}

// ========== TIPOS DE DADOS PARA API ==========
export interface LoginCredentials {
  email: string
  password: string
}

export interface CompleteRegisterData {
  name: string
  password: string
}

export interface StartRegisterData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
}

// ========== TIPOS DE RESPOSTA DA API ==========
export interface AuthResponse {
  success: boolean
  user: User
  message: string
}

export interface MessageResponse {
  email: string | null
  success: boolean
  message: string
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

// ========== ESTADO DO AUTH SLICE ==========
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  registrationStage: 'email' | 'complete' | null
  registrationEmail: string | null
}

// ========== TIPOS DO FIREBASE ==========
export interface FirebaseError extends Error {
  code: string
  customData?: unknown
}
