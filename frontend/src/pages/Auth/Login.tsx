import React from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@core/store/hooks'
import { login, clearError } from '@core/store/slices/authSlice'
import { useErrorHandlerFlexible } from '@features/Auth/hooks/useErrorHandler'
import { formVariants } from '@features/Auth/constants/animations'
import GoogleButton from '@features/Auth/components/GoogleButton'

// Componentes reutilizáveis
import AuthForm from '@/shared/ui/AuthForm'
import FormInput from '@/shared/ui/FormInput'
import FormButton from '@shared/ui/FormButton'

const Login: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)

  // ========== TRATAMENTO DE ERROS ==========
  useErrorHandlerFlexible({
    error: useAppSelector((state) => state.auth.error),
    clearErrorAction: clearError
  })

  // ========== VALIDAÇÃO COM YUP ==========
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Senha é obrigatória')
  })

  // ========== CONFIGURAÇÃO DO FORMIK ==========
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(login(values)).unwrap()
        toast.success('Login realizado com sucesso')
      } catch (error) {
        // Erro será tratado pelo hook
      }
    }
  })

  // ========== RENDER ==========
  return (
    <AuthForm title="Login">
      <form onSubmit={formik.handleSubmit}>
        <FormInput
          id="email"
          label="Email"
          type="email"
          fieldProps={formik.getFieldProps('email')}
          error={formik.errors.email}
          touched={formik.touched.email}
        />

        <FormInput
          id="password"
          label="Senha"
          type="password"
          fieldProps={formik.getFieldProps('password')}
          error={formik.errors.password}
          touched={formik.touched.password}
        />

        <motion.div className="mb-6" variants={formVariants.item}>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Esqueceu a senha?
          </Link>
        </motion.div>

        <motion.div className="mb-4" variants={formVariants.item}>
          <FormButton
            text="Entrar"
            loading={loading}
            disabled={!(formik.isValid && formik.dirty)}
          />
        </motion.div>

        <motion.div
          className="relative mb-4 flex items-center justify-center"
          variants={formVariants.item}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </motion.div>

        <motion.div className="mb-6" variants={formVariants.item}>
          <GoogleButton />
        </motion.div>

        <motion.div
          className="text-center text-sm"
          variants={formVariants.item}
        >
          Não tem uma conta?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700">
            Registre-se
          </Link>
        </motion.div>
      </form>
    </AuthForm>
  )
}

export default Login
