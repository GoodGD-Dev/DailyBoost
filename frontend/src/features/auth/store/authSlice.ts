import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@auth'
import {
  AuthState,
  User,
  LoginCredentials,
  StartRegisterData,
  CompleteRegisterData,
  ResetPasswordData,
  ApiError
} from '../types/auth.types'

// ========== ESTADO INICIAL LIMPO ==========
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  registrationStage: null,
  registrationEmail: null
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

// Inicia registro (apenas email)
export const startRegister = createAsyncThunk(
  'auth/startRegister',
  async (data: StartRegisterData, { rejectWithValue }) => {
    try {
      return await authService.startRegister(data.email)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao iniciar registro'
      )
    }
  }
)

// Completa registro (nome e senha)
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

// Solicita recuperação de senha
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

// Faz logout
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

// Reenvia email de registro
export const resendRegisterEmail = createAsyncThunk(
  'auth/resendRegisterEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.startRegister(email)
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(
        apiError.response?.data?.message || 'Erro ao reenviar email'
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

      // ========== CASOS PARA startRegister ==========
      .addCase(startRegister.pending, (state) => {
        state.loading = true
      })
      .addCase(startRegister.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.registrationStage = 'email'
        state.registrationEmail = action.payload.email
      })
      .addCase(startRegister.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ========== CASOS PARA completeRegister ==========
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
          state.registrationStage = 'complete'
        }
      )
      .addCase(completeRegister.rejected, (state, action) => {
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
        state.registrationStage = null
        state.registrationEmail = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
      })
      // ==========  Casos Para Reenviar Email ==========
      .addCase(resendRegisterEmail.pending, (state) => {
        state.loading = true
      })
      .addCase(resendRegisterEmail.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resendRegisterEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, resetRegistration } = authSlice.actions
export default authSlice.reducer
