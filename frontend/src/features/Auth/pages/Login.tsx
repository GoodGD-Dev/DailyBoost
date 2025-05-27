import React from 'react'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@core'
import { clearError, login, useErrorHandlerFlexible } from '@features'

// Componentes reutilizáveis
import AuthLayout from '@/features/Auth/layout/AuthLayout'
import AuthForm from '@/features/Auth/components/AuthForm'

const Login: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)

  // ========== TRATAMENTO DE ERROS ==========
  useErrorHandlerFlexible({
    error: useAppSelector((state) => state.auth.error),
    clearErrorAction: clearError
  })

  // ========== TIPOS ==========
  type LoginFormValues = {
    email: string
    password: string
  }

  // ========== CONFIGURAÇÃO DOS CAMPOS ==========
  const formFields = [
    {
      id: 'email',
      label: 'Email',
      type: 'email'
    },
    {
      id: 'password',
      label: 'Senha',
      type: 'password'
    }
  ]

  // ========== VALIDAÇÃO COM YUP ==========
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Senha é obrigatória')
  })

  // ========== VALORES INICIAIS ==========
  const initialValues: LoginFormValues = {
    email: '',
    password: ''
  }

  // ========== FUNÇÃO DE SUBMIT ==========
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await dispatch(login(values)).unwrap()
      toast.success('Login realizado com sucesso')
    } catch (error) {
      // Erro será tratado pelo hook
    }
  }

  // ========== RENDER ==========
  return (
    <AuthLayout title="Login">
      <AuthForm<LoginFormValues>
        fields={formFields}
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButton={{
          text: 'Entrar',
          loading,
          variant: 'primary',
          size: 'md'
        }}
        links={{
          forgotPassword: true,
          switchForm: {
            text: 'Não tem uma conta?',
            linkText: 'Registre-se',
            to: '/register'
          }
        }}
        showGoogleButton={true}
      />
    </AuthLayout>
  )
}

export default Login
