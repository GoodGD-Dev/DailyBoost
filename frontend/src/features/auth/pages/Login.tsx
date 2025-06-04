import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@core'
import {
  AuthLayout,
  clearError,
  GoogleButton,
  login,
  pageAnimations
} from '@features'
import { FormButton, FormInput } from '@shared'

const Login: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  // ========== TRATAMENTO DE ERRO DIRETO ==========
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // ========== VALIDAÇÃO COM YUP ==========
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Senha é obrigatória')
  })

  // ========== CONFIGURAÇÃO DO FORMIK ==========
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(login(values)).unwrap()
        toast.success('Login realizado com sucesso')
      } catch (error) {
        // Erro já tratado pelo useEffect
      }
    }
  })

  // ========== RENDER ==========
  return (
    <AuthLayout title="Login">
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

        <motion.div className="mb-4" variants={pageAnimations.item}>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-900"
          >
            Esqueceu a senha?
          </Link>
        </motion.div>

        <motion.div className="mb-4" variants={pageAnimations.item}>
          <FormButton
            text="Entrar"
            loading={loading}
            disabled={!(formik.isValid && formik.dirty)}
            icon={<LogIn className="h-4 w-4" />}
          />
        </motion.div>

        {/* ========== DIVISOR "OU" ========== */}
        <motion.div
          className="relative mb-4 flex items-center justify-center"
          variants={pageAnimations.item}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </motion.div>

        {/* ========== BOTÃO GOOGLE ========== */}
        <motion.div className="mb-6" variants={pageAnimations.item}>
          <GoogleButton />
        </motion.div>

        {/* ========== LINK PARA REGISTRO ========== */}
        <motion.div
          className="text-center text-sm"
          variants={pageAnimations.item}
        >
          Não tem uma conta?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700">
            Registre-se
          </Link>
        </motion.div>
      </form>
    </AuthLayout>
  )
}

export default Login
