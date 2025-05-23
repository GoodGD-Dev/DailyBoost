import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '@core/store/hooks'
import { login, clearError } from '@core/store/slices/authSlice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import GoogleButton from '@features/Auth/components/GoogleButton'

const Login: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  // ========== EFFECT PARA TRATAMENTO DE ERROS ==========
  useEffect(() => {
    if (error) {
      // Se há erro, mostra notificação e limpa o erro do estado
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // ========== VALIDAÇÃO COM YUP ==========
  // Schema de validação para o formulário de login
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    password: Yup.string().required('Senha é obrigatória')
  })

  // ========== CONFIGURAÇÃO DO FORMIK ==========
  // Formik gerencia estado do formulário, validação e submissão
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,

    // Função executada quando formulário é submetido
    onSubmit: async (values) => {
      try {
        // Dispara ação Redux para fazer login
        // values contém { email: '...', password: '...' }
        // .unwrap() converte Promise Redux em Promise normal
        await dispatch(login(values)).unwrap()

        // Se deu certo, mostra notificação de sucesso
        toast.success('Login realizado com sucesso')
      } catch (error) {
        // Se der erro, será capturado pelo useEffect acima
        // que monitora o estado 'error' do Redux
      }
    }
  })

  // ========== CONFIGURAÇÕES DE ANIMAÇÃO ==========

  // Animação do container principal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // Animação dos elementos filhos
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  // ========== RENDER ==========
  return (
    <motion.div
      className="max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Card principal do formulário */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        variants={itemVariants}
      >
        {/* Título da página */}
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          variants={itemVariants}
        >
          Login
        </motion.h2>

        {/* Formulário principal */}
        <form onSubmit={formik.handleSubmit}>
          {/* ========== CAMPO DE EMAIL ========== */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />

            {/* Exibição condicional de erros do email */}
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </motion.div>

          {/* ========== CAMPO DE SENHA ========== */}
          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />

            {/* Exibição condicional de erros da senha */}
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </motion.div>

          {/* ========== LINK "ESQUECEU A SENHA" ========== */}
          <motion.div className="mb-6" variants={itemVariants}>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Esqueceu a senha?
            </Link>
          </motion.div>

          {/* ========== BOTÃO DE LOGIN ========== */}
          <motion.div className="mb-4" variants={itemVariants}>
            <button
              type="submit"
              disabled={loading || !(formik.isValid && formik.dirty)}
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors duration-200
                ${
                  loading || !(formik.isValid && formik.dirty)
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {/* RENDERIZAÇÃO CONDICIONAL - Spinner ou texto */}
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    {/* Círculo base do spinner (mais transparente) */}
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    {/* Parte que cria o efeito de rotação (mais opaca) */}
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </motion.div>

          {/* ========== DIVISOR "OU" ========== */}
          <motion.div
            className="relative mb-4 flex items-center justify-center"
            variants={itemVariants}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </motion.div>

          {/* ========== BOTÃO DE LOGIN COM GOOGLE ========== */}
          <motion.div className="mb-6" variants={itemVariants}>
            <GoogleButton />
          </motion.div>

          {/* ========== LINK PARA REGISTRO ========== */}
          <motion.div className="text-center text-sm" variants={itemVariants}>
            Não tem uma conta?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700">
              Registre-se
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default Login
