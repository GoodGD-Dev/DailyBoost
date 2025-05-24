import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ========== HEADER ========== */}
      <Header />

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
