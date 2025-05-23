import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '@core/store/hooks'
import { forgotPassword, clearError } from '@core/store/slices/authSlice'
import { toast } from 'react-toastify'
import FormButton from '@features/Auth/components/FormButton'
import { motion } from 'framer-motion'

const ForgotPassword: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // ========== EFFECT PARA TRATAMENTO DE ERROS ==========
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // ========== VALIDAÇÃO COM YUP ==========
  // Schema de validação para o formulário
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório')
  })

  // ========== CONFIGURAÇÃO DO FORMIK ==========
  // Formik gerencia estado do formulário, validação e submissão
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,

    // Função executada quando formulário é submetido
    onSubmit: async (values) => {
      try {
        // Dispara ação Redux para solicitar reset de senha
        // .unwrap() converte Promise Redux em Promise normal
        await dispatch(forgotPassword(values.email)).unwrap()
        setIsSubmitted(true)
      } catch (error) {}
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
      {/* Card principal */}
      <motion.div className="card" variants={itemVariants}>
        {/* Título da página */}
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          variants={itemVariants}
        >
          Esqueci a Senha
        </motion.h2>

        {/* RENDERIZAÇÃO CONDICIONAL - Baseada no estado isSubmitted */}
        {isSubmitted ? (
          <motion.div variants={itemVariants}>
            {/* Mensagem de sucesso */}
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              Enviamos um email com instruções para redefinir sua senha. Por
              favor, verifique sua caixa de entrada.
            </div>

            {/* Link para voltar ao login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700"
              >
                Voltar para o login
              </Link>
            </div>
          </motion.div>
        ) : (
          // ========== ESTADO: FORMULÁRIO DE SOLICITAÇÃO ==========
          <form onSubmit={formik.handleSubmit}>
            {/* Texto explicativo */}
            <motion.p className="text-gray-600 mb-6" variants={itemVariants}>
              Digite seu email abaixo e enviaremos um link para redefinir sua
              senha.
            </motion.p>

            {/* Campo de email */}
            <motion.div className="mb-6" variants={itemVariants}>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps('email')}
                className="input"
              />

              {/* Exibição condicional de erros */}
              {formik.touched.email && formik.errors.email ? (
                <div className="error-text">{formik.errors.email}</div>
              ) : null}
            </motion.div>

            {/* Botão de envio */}
            <motion.div className="mb-6" variants={itemVariants}>
              <FormButton
                text="Enviar Link de Redefinição"
                loading={loading}
                disabled={!(formik.isValid && formik.dirty)}
              />
            </motion.div>

            {/* Link para voltar ao login */}
            <motion.div className="text-center text-sm" variants={itemVariants}>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700"
              >
                Voltar para o login
              </Link>
            </motion.div>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export default ForgotPassword
