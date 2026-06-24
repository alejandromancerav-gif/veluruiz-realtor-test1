'use client';

import React from 'react';
import { useAppState } from '../../context/AppStateContext';

export default function AboutPage() {
  const { language } = useAppState();

  return (
    /* CORREGIDO: Cambiado de 950 a dark:bg-brand-navy-900 */
    <div className="bg-slate-50 dark:bg-brand-navy-900 min-h-screen py-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        {/* Cabecera */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">
            {language === 'en' ? 'Human & Trustworthy' : 'Cercanía y Transparencia'}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight">
            {language === 'en' ? 'The Team Behind Veluruiz' : 'El Equipo de Veluruiz Realtor'}
          </h1>
          <p className="text-sm md:text-base text-brand-navy-400 max-w-2xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Founded by two passionate real estate partners, we are a dynamic team focused on making property buying and renting accessible, clear, and frictionless for everyone.'
              : 'Fundado por dos socios apasionados del sector inmobiliario, somos un equipo dinámico enfocado en hacer que la compra y el alquiler de propiedades sea un proceso accesible, transparente y sin fricciones para todos.'}
          </p>
        </div>

        {/* Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white dark:bg-brand-navy-900 p-6 rounded-xl border border-slate-100 dark:border-brand-navy-800 shadow-premium">
            <span className="text-xl">🤝</span>
            <h4 className="font-bold text-brand-navy-900 dark:text-white mt-2 mb-1">{language === 'en' ? 'Trust' : 'Confianza Absoluta'}</h4>
            <p className="text-xs text-brand-navy-400 dark:text-slate-400">{language === 'en' ? 'No hidden fees, no complex jargon. Simple real estate.' : 'Sin comisiones ocultas ni tecnicismos complejos. Procesos claros.'}</p>
          </div>
          <div className="bg-white dark:bg-brand-navy-900 p-6 rounded-xl border border-slate-100 dark:border-brand-navy-800 shadow-premium">
            <span className="text-xl">🌍</span>
            <h4 className="font-bold text-brand-navy-900 dark:text-white mt-2 mb-1">{language === 'en' ? 'For Everyone' : 'Para Todos'}</h4>
            <p className="text-xs text-brand-navy-400 dark:text-slate-400">{language === 'en' ? 'From cozy starter apartments to high-end family spaces.' : 'Desde un apartamento compacto hasta residencias amplias.'}</p>
          </div>
          <div className="bg-white dark:bg-brand-navy-900 p-6 rounded-xl border border-slate-100 dark:border-brand-navy-800 shadow-premium">
            <span className="text-xl">🔒</span>
            <h4 className="font-bold text-brand-navy-900 dark:text-white mt-2 mb-1">{language === 'en' ? 'Privacy Controls' : 'Protección Privada'}</h4>
            <p className="text-xs text-brand-navy-400 dark:text-slate-400">{language === 'en' ? 'Premium listings handled safely off-market.' : 'Opciones exclusivas protegidas fuera del catálogo público.'}</p>
          </div>
        </div>

      </div>
    </div>
  );
}