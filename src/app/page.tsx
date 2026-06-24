'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '../context/AppStateContext';

export default function HomePage() {
  const { language } = useAppState();

  return (
    /* CORREGIDO: Ahora usa dark:bg-brand-navy-900 de forma estricta */
    <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-brand-navy-900 py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        
        {/* Etiqueta superior sutil */}
        <span className="inline-block text-xs font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-3 py-1.5 rounded-full">
          {language === 'en' ? 'Exclusive Real Estate Portfolio' : 'Portafolio Inmobiliario Exclusivo'}
        </span>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight leading-none transition-colors duration-300">
          {language === 'en' ? 'Your Trusted Portfolio for Finding' : 'Tu Portafolio de Confianza para Encontrar'}{' '}
          
          {/* El degradado premium que te gustó se mantiene intacto aquí */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-amber-500 block sm:inline">
            {language === 'en' ? 'Properties' : 'Inmuebles'}
          </span>
        </h1>

        {/* Subtexto descriptivo general */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-brand-navy-600 dark:text-brand-navy-200 leading-relaxed transition-colors duration-300">
          {language === 'en'
            ? 'Explore a diverse catalog tailored to your needs. Find everything from practical apartments and commercial offices to ideal spaces for your next big step.'
            : 'Explora un catálogo variado y diseñado a la medida de tus necesidades. Encuentra desde apartamentos prácticos y oficinas comerciales hasta espacios ideales para tu próximo gran paso.'}
        </p>

        {/* Grupo de Botones de Acción */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            href="/catalog" 
            className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-colors shadow-lg shadow-brand-accent/20 text-center"
          >
            {language === 'en' ? 'Explore Catalog' : 'Explorar Catálogo'}
          </Link>
          
          <Link 
            href="/contact" 
            className="w-full sm:w-auto bg-brand-navy-900 dark:bg-brand-navy-800 hover:bg-brand-navy-800 dark:hover:bg-brand-navy-700 text-white border border-brand-navy-800 dark:border-brand-navy-700 px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-colors text-center"
          >
            {language === 'en' ? 'Contact Advisor' : 'Contactar Asesor'}
          </Link>
        </div>

      </div>
    </div>
  );
}