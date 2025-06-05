import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserSection } from '@features'
import { ThemeSelector } from '@theme'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <motion.nav
      className="theme-bg-white theme-border-gray-100 py-4 sticky top-0 z-50 shadow-sm border-b"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center">
          {/* LOGO */}
          <Link
            to="/"
            className="theme-text-primary-600 font-bold text-xl tracking-tight"
          >
            DailyBoost
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeSelector />
            <UserSection />
          </div>

          {/* BOTÃO HAMBÚRGUER (MOBILE) */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 theme-text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* MENU MOBILE */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 py-4 border-t theme-border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              <ThemeSelector />
              <UserSection isMobile={true} onMenuClose={closeMenu} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Header
