import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { Mail } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@core'
import { clearError, resetRegistration, startRegister } from '@auth'
import { Btns } from '@shared'

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
    <div className="max-w-md mx-auto theme-card p-6">
      <h1 className="text-2xl font-bold text-center mb-6 theme-text-gray-800">
        Criar Conta
      </h1>

      {isSubmitted ? (
        // ========== ESTADO: EMAIL ENVIADO COM SUCESSO ==========
        <div className="space-y-4">
          <div className="theme-alert-success">
            {/* Ícone de email */}
            <div className="flex items-center mb-2">
              <Mail className="w-5 h-5 mr-2" />
              <span className="font-medium">Email enviado!</span>
            </div>
            <p className="mb-2">
              Enviamos um link de confirmação para{' '}
              <strong>{registrationEmail}</strong>
            </p>
            <p className="text-sm theme-text-success-600">
              Clique no link recebido para completar seu registro com nome e
              senha.
            </p>
          </div>

          {/* Instruções adicionais */}
          <div className="theme-alert-info">
            <p className="text-sm">
              <strong>Não recebeu o email?</strong>
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Verifique sua pasta de spam</li>
              <li>• O email pode demorar alguns minutos para chegar</li>
              <li>• Certifique-se de que o email está correto</li>
            </ul>
          </div>

          {/* ========== BOTÕES COM SEU COMPONENTE ========== */}
          <div className="space-y-3">
            {/* ✅ USANDO SEU COMPONENTE Btns */}
            <Btns
              text="Tentar com outro email"
              type="button"
              variant="primary"
              size="md"
              fullWidth={true}
              loading={false}
              disabled={false}
              onClick={handleTryAgain}
            />

            <div className="text-center">
              <Link to="/login" className="theme-link text-sm">
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // ========== ESTADO: FORMULÁRIO DE EMAIL ==========
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <p className="theme-text-gray-600 text-center">
              Vamos começar com seu email. Enviaremos um link para você
              completar o registro.
            </p>

            <div>
              <label htmlFor="email" className="theme-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps('email')}
                placeholder="seu@email.com"
                disabled={loading}
                className={`theme-input ${
                  formik.touched.email && formik.errors.email
                    ? 'theme-input-error'
                    : ''
                } ${loading ? 'opacity-50' : ''}`}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="theme-error-message">
                  <svg
                    className="w-4 h-4 mr-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            {/* ========== BOTÃO DE SUBMIT COM SEU COMPONENTE ========== */}
            <Btns
              text="Enviar Link de Registro"
              type="submit"
              variant="primary"
              size="md"
              fullWidth={true}
              loading={loading}
              disabled={!(formik.isValid && formik.dirty)}
              icon={<Mail className="h-4 w-4" />}
            />

            <div className="text-center text-sm">
              <span className="theme-text-gray-600">Já tem uma conta? </span>
              <Link to="/login" className="theme-link">
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
