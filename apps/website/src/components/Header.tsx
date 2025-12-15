import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { WhatsAppButton } from './ui/WhatsApp';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo & Brand */}
        <Link to="/" className="group flex items-center gap-3">
          <img 
            src="/icons/icon-128.png" 
            alt="Mallorca Gardens Logo" 
            className="h-10 w-10 md:h-12 md:w-12" 
          />
          <span className="text-xl font-bold text-green-800 transition-colors group-hover:text-green-700 md:text-2xl">
            Mallorca Gardens
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="font-medium text-gray-600 transition-colors hover:text-green-700">Home</Link>
          <Link to="/projects" className="font-medium text-gray-600 transition-colors hover:text-green-700">Projects</Link>
          <WhatsAppButton 
            phoneNumber="34123456789" 
            message="Hola James! I need a website built."
            variant="solid"
          />
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-green-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-20 border-t border-gray-100 bg-white px-4 py-6 shadow-lg md:hidden">
          <nav className="flex flex-col gap-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg font-medium text-gray-600 hover:text-green-700">Home</Link>
            <Link to="/projects" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg font-medium text-gray-600 hover:text-green-700">Projects</Link>
            <WhatsAppButton 
              phoneNumber="34123456789" 
              message="Hola James! I need a website built."
              variant="solid"
            />
          </nav>
        </div>
      )}
    </header>
  );
}