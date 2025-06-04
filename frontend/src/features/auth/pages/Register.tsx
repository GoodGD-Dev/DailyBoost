import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { Mail } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@core'
import { clearError, resetRegistration, startRegister } from '@features'

const Register: React.FC = () => {
  // ========== HOOKS ==========
  const dispatch = useAppDispatch()
  const { loading, error, registrationStage, registrationEmail } =
    useAppSelector((state) => state.auth)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // ========== EFFECT PARA TRATAMENTO DE ERROS ==========
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // ========== EFFECT PARA CONTROLAR ESTADO APÓS SUCESSO ==========
  useEffect(() => {
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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Criar Conta
      </h1>

      {isSubmitted ? (
        // ========== ESTADO: EMAIL ENVIADO COM SUCESSO ==========
        <div className="space-y-4">
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
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Tentar com outro email
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // ========== ESTADO: FORMULÁRIO DE EMAIL ==========
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <p className="text-gray-600 text-center">
              Vamos começar com seu email. Enviaremos um link para você
              completar o registro.
            </p>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 mb-2 font-medium"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps('email')}
                placeholder="seu@email.com"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={!(formik.isValid && formik.dirty) || loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Enviar Link de Registro
                </>
              )}
            </button>

            <div className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Faça login
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default Register
