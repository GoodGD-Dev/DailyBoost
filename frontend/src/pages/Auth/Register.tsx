import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import {
  useAppDispatch,
  useAppSelector,
  startRegister,
  clearError,
  resetRegistration
} from '@core'
import { formVariants } from '@features'
import { FormButton } from '@shared'

const Register: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const { loading, error, registrationStage, registrationEmail } =
    useAppSelector((state) => state.auth)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // ========== EFFECT PARA TRATAMENTO DE ERROS ==========
  React.useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // ========== EFFECT PARA CONTROLAR ESTADO APÓS SUCESSO ==========
  React.useEffect(() => {
    if (registrationStage === 'email') {
      setIsSubmitted(true)
      toast.success(
        'Email de registro enviado! Verifique sua caixa de entrada.'
      )
    }
  }, [registrationStage])

  // ========== VALIDAÇÃO COM YUP ==========
  const validationSchema = Yup.object({
    email: Yup.string().email('Email inválido').required('Email é obrigatório')
  })

  // ========== CONFIGURAÇÃO DO FORMIK ==========
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(startRegister(values)).unwrap()
        // setIsSubmitted será chamado pelo useEffect
      } catch (error) {
        // Erros são tratados pelo useEffect
      }
    }
  })

  // ========== FUNÇÃO PARA TENTAR NOVAMENTE ==========
  const handleTryAgain = () => {
    setIsSubmitted(false)
    dispatch(resetRegistration())
    formik.resetForm()
  }

  // ========== RENDER ==========
  return (
    <motion.div
      className="max-w-md mx-auto"
      variants={formVariants.container}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="card" variants={formVariants.item}>
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          variants={formVariants.item}
        >
          Criar Conta
        </motion.h2>

        {isSubmitted ? (
          // ========== ESTADO: EMAIL ENVIADO COM SUCESSO ==========
          <motion.div variants={formVariants.item}>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {/* Ícone de email */}
              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 mr-2" />
                <span className="font-medium">Email enviado!</span>
              </div>
              <p className="mb-2">
                Enviamos um link de confirmação para{' '}
                <strong>{registrationEmail}</strong>
              </p>
              <p className="text-sm text-green-600">
                Clique no link recebido para completar seu registro com nome e
                senha.
              </p>
            </div>

            {/* Instruções adicionais */}
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
              <p className="text-sm">
                <strong>Não recebeu o email?</strong>
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Verifique sua pasta de spam</li>
                <li>• O email pode demorar alguns minutos para chegar</li>
                <li>• Certifique-se de que o email está correto</li>
              </ul>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Tentar com outro email
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  Voltar para o login
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          // ========== ESTADO: FORMULÁRIO DE EMAIL ==========
          <form onSubmit={formik.handleSubmit}>
            <motion.p
              className="text-gray-600 mb-6 text-center"
              variants={formVariants.item}
            >
              Vamos começar com seu email. Enviaremos um link para você
              completar o registro.
            </motion.p>

            <motion.div className="mb-6" variants={formVariants.item}>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps('email')}
                className="input"
                placeholder="seu@email.com"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error-text">{formik.errors.email}</div>
              ) : null}
            </motion.div>

            <motion.div className="mb-6" variants={formVariants.item}>
              <FormButton
                text="Enviar Link de Registro"
                loading={loading}
                disabled={!(formik.isValid && formik.dirty)}
                icon={<Mail className="h-4 w-4" />}
              />
            </motion.div>

            <motion.div
              className="text-center text-sm"
              variants={formVariants.item}
            >
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Faça login
              </Link>
            </motion.div>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Register
