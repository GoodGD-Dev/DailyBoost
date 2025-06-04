import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@core'
import {
  AuthLayout,
  clearError,
  forgotPassword,
  pageAnimations
} from '@features'
import { FormButton, FormInput } from '@shared'

const ForgotPassword: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // ========== TRATAMENTO DE ERRO DIRETO ==========
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

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
        await dispatch(forgotPassword(values.email)).unwrap()
        setIsSubmitted(true)
        toast.success('Email de redefinição enviado!')
      } catch (error) {
        // Erro já tratado pelo useEffect
      }
    }
  })

  // ========== RENDER ==========
  return (
    <AuthLayout title="Esqueci a Senha">
      {isSubmitted ? (
        <motion.div variants={pageAnimations.item}>
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center mb-2">
              <Mail className="w-5 h-5 mr-2" />
              <span className="font-medium">Email enviado!</span>
            </div>
            <p className="mb-2">
              Enviamos um email com instruções para redefinir sua senha. Por
              favor, verifique sua caixa de entrada.
            </p>
            <p className="text-sm text-green-600">
              Redirecionando para a página inicial em alguns segundos...
            </p>
          </div>

          <div className="text-center space-y-2">
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ir para página inicial agora
              </button>
            </div>
            <div>
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
        <form onSubmit={formik.handleSubmit}>
          <motion.p
            className="text-gray-600 mb-6"
            variants={pageAnimations.item}
          >
            Digite seu email abaixo e enviaremos um link para redefinir sua
            senha.
          </motion.p>

          <FormInput
            id="email"
            label="Email"
            type="email"
            fieldProps={formik.getFieldProps('email')}
            error={formik.errors.email}
            touched={formik.touched.email}
            className="mb-6"
          />

          <motion.div className="mb-6" variants={pageAnimations.item}>
            <FormButton
              text="Enviar Link de Redefinição"
              loading={loading}
              disabled={!(formik.isValid && formik.dirty)}
              icon={<Mail className="h-4 w-4" />}
            />
          </motion.div>

          <motion.div
            className="text-center text-sm"
            variants={pageAnimations.item}
          >
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Voltar para o login
            </Link>
          </motion.div>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPassword
