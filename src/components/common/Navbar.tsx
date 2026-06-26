'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useAppState();
  const { user } = useAuth();
  const portalHref = user ? '/client' : '/login?next=/client';

  const navLinks = [
    { name: language === 'en' ? 'Home' : 'Inicio', href: '/' },
    { name: language === 'en' ? 'Catalog' : 'Catálogo', href: '/catalog' },
    { name: language === 'en' ? 'About Us' : 'Nosotros', href: '/about' },
    { name: language === 'en' ? 'Favorites' : 'Favoritos', href: '/favorites' },
    { name: language === 'en' ? 'Contact' : 'Contacto', href: '/contact' },
  ];

  return (
    // Fondo azul en ambos modos (un poco más oscuro en dark mode) con textos claros obligatorios
    <nav className="sticky top-0 z-50 bg-brand-navy-500 dark:bg-brand-navy-900 border-b border-brand-navy-600 dark:border-brand-navy-800 transition-colors duration-300 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo e Isotipo Blanco (Visible siempre gracias al fondo azul) */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <img 
              src="/images/logo_white.png" 
              alt="Veluruiz Isotype" 
              className="h-9 w-auto object-contain flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-white uppercase transition-colors group-hover:text-brand-accent">
                Veluruiz
              </span>
              <span className="text-xs tracking-widest text-brand-accent font-semibold uppercase -mt-1">
                Realtor
              </span>
            </div>
          </Link>

          {/* Menú de navegación de escritorio */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                    isActive 
                      ? 'text-white font-semibold' 
                      : 'text-brand-navy-200 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="navUnderline" 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Botones de Acción de escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="text-xs font-bold border border-brand-navy-300 dark:border-brand-navy-700 px-2.5 py-1 rounded transition hover:bg-white/10 text-white"
            >
              {language.toUpperCase()}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-brand-navy-200 hover:text-white text-lg transition-colors"
              aria-label={language === 'en' ? 'Toggle Theme' : 'Cambiar Tema'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Botón destacado con el nuevo Naranja de marca */}
            <Link
              href={portalHref}
              className="bg-brand-accent hover:bg-brand-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-md"
            >
              {language === 'en' ? 'Client Portal' : 'Portal Cliente'}
            </Link>
          </div>

          {/* Hamburguesa Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 text-base text-brand-navy-200 hover:text-white">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none p-2"
            >
              <div className="space-y-1.5 w-6">
                <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-navy-600 dark:bg-brand-navy-950 border-b border-brand-navy-500 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-brand-navy-200 hover:text-white py-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-brand-navy-500 flex items-center justify-between">
                <button
                  onClick={() => { setLanguage(language === 'en' ? 'es' : 'en'); setIsOpen(false); }}
                  className="text-sm font-bold border border-brand-navy-400 px-3 py-1.5 rounded text-white"
                >
                  Idioma: {language.toUpperCase()}
                </button>
                <Link
                  href={portalHref}
                  onClick={() => setIsOpen(false)}
                  className="bg-brand-accent text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {language === 'en' ? 'Client Portal' : 'Portal Cliente'}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}