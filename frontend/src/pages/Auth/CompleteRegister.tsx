import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { UserPlus, CheckCircle } from 'lucide-react'
import {
  useAppDispatch,
  useAppSelector,
  completeRegister,
  clearError
} from '@core'
import { formVariants } from '@features'
import { FormButton, FormInput } from '@shared'

const CompleteRegister: React.FC = () => {
  // ========== HOOKS ==========
  const { token } = useParams<{ token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated, user, registrationStage } =
    useAppSelector((state) => state.auth)
  const [isSuccess, setIsSuccess] = useState(false)

  // ========== VALIDAÇÃO DO TOKEN ==========
  useEffect(() => {
    if (!token) {
      toast.error('Token de registro inválido')
      navigate('/register')
    }
  }, [token, navigate])

  // ========== EFFECT PARA TRATAMENTO DE ERROS ==========
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // ========== EFFECT PARA REDIRECIONAMENTO APÓS SUCESSO ==========
  useEffect(() => {
    if (registrationStage === 'complete' && isAuthenticated) {
      setIsSuccess(true)
      toast.success('Registro completado com sucesso!')

      // Redireciona com delay
      setTimeout(() => {
        if (user && !user.isEmailVerified) {
          navigate('/verify-required')
        } else {
          navigate('/dashboard')
        }
      }, 2000)
    }
  }, [registrationStage, isAuthenticated, user, navigate])

  // ========== VALIDAÇÃO COM YUP ==========
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres'),
    password: Yup.string()
      .required('Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Senhas não conferem')
      .required('Confirmação de senha é obrigatória')
  })

  // ========== CONFIGURAÇÃO DO FORMIK ==========
  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!token) return

      try {
        const { confirmPassword, ...userData } = values
        await dispatch(
          completeRegister({
            token,
            data: userData
          })
        ).unwrap()
        // setIsSuccess será chamado pelo useEffect
      } catch (error) {
        // Erros são tratados pelo useEffect
      }
    }
  })

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
          Completar Registro
        </motion.h2>

        {isSuccess ? (
          // ========== ESTADO: REGISTRO COMPLETADO ==========
          <motion.div variants={formVariants.item}>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-medium">Registro completado!</span>
              </div>
              <p>
                Sua conta foi criada com sucesso. Você será redirecionado em
                instantes.
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ir para o dashboard agora
              </button>
            </div>
          </motion.div>
        ) : (
          // ========== ESTADO: FORMULÁRIO DE COMPLETAR REGISTRO ==========
          <form onSubmit={formik.handleSubmit}>
            <motion.p
              className="text-gray-600 mb-6 text-center"
              variants={formVariants.item}
            >
              Quase lá! Agora complete seu registro com seu nome e senha.
            </motion.p>

            <FormInput
              id="name"
              label="Nome completo"
              type="text"
              fieldProps={formik.getFieldProps('name')}
              error={formik.errors.name}
              touched={formik.touched.name}
            />

            <FormInput
              id="password"
              label="Senha"
              type="password"
              fieldProps={formik.getFieldProps('password')}
              error={formik.errors.password}
              touched={formik.touched.password}
            />

            <FormInput
              id="confirmPassword"
              label="Confirmar senha"
              type="password"
              fieldProps={formik.getFieldProps('confirmPassword')}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              className="mb-6"
            />

            <motion.div className="mb-6" variants={formVariants.item}>
              <FormButton
                text="Completar Registro"
                loading={loading}
                disabled={!(formik.isValid && formik.dirty)}
                icon={<UserPlus className="h-4 w-4" />}
              />
            </motion.div>

            <motion.div
              className="text-center text-sm"
              variants={formVariants.item}
            >
              <Link
                to="/register"
                className="text-gray-600 hover:text-gray-700"
              >
                Voltar para o início
              </Link>
            </motion.div>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export default CompleteRegister
