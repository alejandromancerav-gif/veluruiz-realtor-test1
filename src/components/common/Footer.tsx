'use client';
import React from 'react';
import Link from 'next/link';
import { useAppState } from '../../context/AppStateContext';

export default function Footer() {
  const { language } = useAppState();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy-900 text-white border-t border-brand-navy-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Branding e Isotipo */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo_white.png" 
                alt="Veluruiz Isotype" 
                className="h-8 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wider uppercase text-white">
                  Veluruiz
                </span>
                <span className="text-xs tracking-widest text-brand-accent font-semibold uppercase -mt-1">
                  Realtor
                </span>
              </div>
            </div>
            {/* Descripción adaptada: Más cercana, general y abierta a todo presupuesto */}
            <p className="text-sm text-brand-navy-300 leading-relaxed">
              {language === 'en'
                ? 'Your trusted real estate partner in finding the perfect property, tailored to your budget, needs, and lifestyle.'
                : 'Tu aliado inmobiliario de confianza para encontrar la propiedad ideal, adaptada a tu presupuesto, necesidades y estilo de vida.'}
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-brand-accent uppercase mb-4">
              {language === 'en' ? 'Navigation' : 'Navegación'}
            </h4>
            <ul className="space-y-2 text-sm text-brand-navy-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Home' : 'Inicio'}
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Catalog' : 'Catálogo'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {language === 'en' ? 'About Us' : 'Nosotros'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Contact' : 'Contacto'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Servicios / Portafolio Generalizado */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-brand-accent uppercase mb-4">
              {language === 'en' ? 'Services' : 'Servicios'}
            </h4>
            <ul className="space-y-2 text-sm text-brand-navy-200">
              <li>
                {language === 'en' ? 'Houses & Homes' : 'Casas y Hogares'}
              </li>
              <li>
                {language === 'en' ? 'Apartments' : 'Apartamentos'}
              </li>
              <li>
                {language === 'en' ? 'Offices & Commercial' : 'Oficinas y Locales'}
              </li>
              <li>
                {language === 'en' ? 'Real Estate Advisory' : 'Asesoría Inmobiliaria'}
              </li>
            </ul>
          </div>

          {/* Columna 4: Ubicación y Contacto Oficial */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold tracking-wider text-brand-accent uppercase mb-1">
              {language === 'en' ? 'Presence' : 'Presencia'}
            </h4>
            <p className="text-sm text-brand-navy-200 flex items-center gap-2">
              <span>📍</span> Caracas, Venezuela
            </p>
            <p className="text-sm text-brand-navy-200 flex items-center gap-2">
              <span>✉️</span> advisory@veluruiz.com
            </p>
            <p className="text-sm text-brand-navy-200 flex items-center gap-2">
              <span>📞</span> +58 (412) 555-0190
            </p>
          </div>

        </div>

        {/* Línea divisoria inferior de Copyright */}
        <div className="mt-12 pt-6 border-t border-brand-navy-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-navy-400">
          <p>
            &copy; {currentYear} Veluruiz Realtor. {language === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-brand-navy-200 transition-colors">
              {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
            </Link>
            <Link href="/terms" className="hover:text-brand-navy-200 transition-colors">
              {language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}