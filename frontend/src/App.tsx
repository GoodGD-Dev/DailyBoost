import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@core/store/hooks'
import { loadUser } from '@core/store/slices/authSlice'
import { AnimatePresence } from 'framer-motion'
import Router from '@core/router/Router'
import LoadingScreen from '@shared/components/LoadingScreen'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const { loading: authLoading } = useAppSelector((state) => state.auth)

  // Verifica se o usuário já está autenticado (token JWT) ao carregar a aplicação
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  // Mostra loading enquanto verifica o estado de autenticação
  if (authLoading) {
    return <LoadingScreen />
  }

  return (
    <AnimatePresence mode="wait">
      <Router />
    </AnimatePresence>
  )
}

export default App
