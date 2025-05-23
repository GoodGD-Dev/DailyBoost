import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAppSelector } from '@core/store/hooks'
import Navbar from './Navbar'
import Footer from './Footer'

// ========== COMPONENTE LAYOUT ==========
// Layout base que será usado em todas as páginas da aplicação
const Layout: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // ========== RENDER ==========
  return (
    <div className="flex flex-col min-h-screen">
      {/* ========== NAVBAR ========== */}
      <Navbar />
      {/* ========== CONTEÚDO PRINCIPAL ========== */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <Outlet />
      </main>
      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  )
}

export default Layout
