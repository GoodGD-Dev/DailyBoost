import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import authService from '@features/Auth/services/authService'

// ========== DEFINIÇÃO DE TIPOS/INTERFACES ==========

// Interface para o estado de autenticação
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  registrationStage: 'email' | 'complete' | null // Nova propriedade para controlar as etapas
  registrationEmail: string | null // Email usado no registro
}

// Interface para o usuário
interface User {
  id: string
  name: string
  email: string
  isEmailVerified: boolean
}

// ========== INTERFACES PARA DADOS DE ENTRADA ==========

// Dados necessários para fazer login
interface LoginCredentials {
  email: string
  password: string
}

// Dados para iniciar registro (apenas email)
interface StartRegisterData {
  email: string
}

// Dados para completar registro (nome e senha)
interface CompleteRegisterData {
  name: string
  password: string
}

// Dados para redefinir senha
interface ResetPasswordData {
  token: string
  password: string
}

// Interface para erros da API
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

// ========== ESTADO INICIAL ==========

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Começa como true para verificar o token existente no início
  error: null,
  registrationStage: null, // Nova propriedade
  registrationEmail: null // Nova propriedade
}

// ========== AÇÕES ASSÍNCRONAS (THUNKS) ==========

// Verifica se há um usuário logado quando a aplicação inicia
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao carregar usuário'
      )
    }
  }
)

// Faz login com email e senha
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao fazer login'
      )
    }
  }
)

// Faz login usando conta do Google
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken: string, { rejectWithValue }) => {
    try {
      return await authService.googleLogin(idToken)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao fazer login com Google'
      )
    }
  }
)

// ========== NOVO: INICIA REGISTRO (APENAS EMAIL) ==========
export const startRegister = createAsyncThunk(
  'auth/startRegister',
  async (data: StartRegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.startRegister(data.email)
      return { ...response, email: data.email } // Inclui o email na resposta
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao iniciar registro'
      )
    }
  }
)

// ========== NOVO: COMPLETA REGISTRO (NOME E SENHA) ==========
export const completeRegister = createAsyncThunk(
  'auth/completeRegister',
  async (
    { token, data }: { token: string; data: CompleteRegisterData },
    { rejectWithValue }
  ) => {
    try {
      return await authService.completeRegister(token, data)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao completar registro'
      )
    }
  }
)

// Verifica o email usando o token enviado por email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token)
      return response
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao verificar email'
      )
    }
  }
)

// Reenvia o email de verificação
export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.resendVerificationEmail(email)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message ||
          'Erro ao reenviar email de verificação'
      )
    }
  }
)

// Solicita recuperação de senha (envia email com link)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.forgotPassword(email)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message ||
          'Erro ao enviar email de recuperação'
      )
    }
  }
)

// Redefine a senha usando o token do email
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      return await authService.resetPassword(data.token, data.password)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao redefinir senha'
      )
    }
  }
)

// Faz logout (remove token e limpa dados)
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.logout()
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao fazer logout'
      )
    }
  }
)

// ========== SLICE - CONFIGURAÇÃO PRINCIPAL ==========

const authSlice = createSlice({
  name: 'auth',
  initialState,

  // ========== REDUCERS SÍNCRONOS ==========
  reducers: {
    // Limpa mensagens de erro
    clearError: (state) => {
      state.error = null
    },

    // Reseta o estado de registro
    resetRegistration: (state) => {
      state.registrationStage = null
      state.registrationEmail = null
    }
  },

  // ========== REDUCERS ASSÍNCRONOS ==========
  extraReducers: (builder) => {
    builder
      // ========== CASOS PARA loadUser ==========
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = action.payload as string
      })

      // ========== CASOS PARA login ==========
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
        // Limpa dados de registro ao fazer login
        state.registrationStage = null
        state.registrationEmail = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA googleLogin ==========
      .addCase(googleLogin.pending, (state) => {
        state.loading = true
      })
      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
        // Limpa dados de registro ao fazer login
        state.registrationStage = null
        state.registrationEmail = null
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== NOVO: CASOS PARA startRegister ==========
      .addCase(startRegister.pending, (state) => {
        state.loading = true
      })
      .addCase(startRegister.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.registrationStage = 'email' // Indica que o email foi enviado
        state.registrationEmail = action.payload.email // Salva o email usado
      })
      .addCase(startRegister.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== NOVO: CASOS PARA completeRegister ==========
      .addCase(completeRegister.pending, (state) => {
        state.loading = true
      })
      .addCase(
        completeRegister.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false
          state.isAuthenticated = true
          state.user = action.payload
          state.error = null
          state.registrationStage = 'complete' // Indica que o registro foi completado
        }
      )
      .addCase(completeRegister.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA verifyEmail ==========
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false
        state.error = null

        if (action.payload?.user) {
          state.isAuthenticated = true
          state.user = action.payload.user
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA resendVerificationEmail ==========
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA forgotPassword ==========
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA resetPassword ==========
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA logout ==========
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = null
        // Limpa dados de registro ao fazer logout
        state.registrationStage = null
        state.registrationEmail = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
      })
  }
})

export const { clearError, resetRegistration } = authSlice.actions
export default authSlice.reducer
