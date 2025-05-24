import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
      <div className="container mx-auto">
        <p>
          &copy; {new Date().getFullYear()} DailyBoost - Todos os direitos
          reservados
        </p>
      </div>
    </footer>
  )
}

export default Footer
