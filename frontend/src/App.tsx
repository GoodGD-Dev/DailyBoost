import React, { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector, Router } from '@core'
import { LoadingScreen } from '@shared'
import { loadUser } from '@features'

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
