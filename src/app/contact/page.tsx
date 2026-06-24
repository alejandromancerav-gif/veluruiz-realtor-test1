'use client';

import React from 'react';
import { useAppState } from '../../context/AppStateContext';

export default function ContactPage() {
  const { language } = useAppState();

  return (
    <div className="bg-slate-50 dark:bg-brand-navy-950 min-h-screen py-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-brand-navy-900 rounded-2xl border border-slate-100 dark:border-brand-navy-800 shadow-premium p-8 md:p-12 transition-colors">
          
          {/* Datos Directos */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">{language === 'en' ? 'Connect' : 'Contacto Directo'}</span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight mt-2">
                {language === 'en' ? "Let's find your place" : 'Encontremos tu próximo espacio'}
              </h1>
              <p className="text-xs text-brand-navy-400 mt-2 leading-relaxed">
                {language === 'en' ? 'Drop us a line or text us directly via WhatsApp. Our team will assist you shortly.' : 'Escríbenos o envíanos un WhatsApp. Nuestro equipo responderá tu requerimiento a la brevedad.'}
              </p>
            </div>

            <div className="space-y-3 text-xs text-brand-navy-500 dark:text-slate-300">
              <p>📍 Caracas, Venezuela</p>
              <p>✉️ advisory@veluruiz.com</p>
              <p>📞 +58 (412) 555-0190</p>
            </div>
          </div>

          {/* Formulario */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">{language === 'en' ? 'Full Name' : 'Nombre Completo'}</label>
              <input type="text" className="w-full text-xs p-3 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Email</label>
              <input type="email" className="w-full text-xs p-3 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">{language === 'en' ? 'Message' : 'Mensaje'}</label>
              <textarea rows={4} className="w-full text-xs p-3 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none resize-none" required></textarea>
            </div>
            <button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white py-3 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider shadow-md">
              {language === 'en' ? 'Send Inquiry' : 'Enviar Mensaje'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}