'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  language: 'es' | 'en';
}

export default function ScheduleModal({ isOpen, onClose, propertyTitle, language }: ScheduleModalProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Accesibilidad: Cerrar con la tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulación de carga asíncrona de nivel de producción
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Overlay de Fondo con desenfoque cinematográfico */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-navy-950/60 backdrop-blur-md"
          />

          {/* Contenedor de la Tarjeta del Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white dark:bg-brand-navy-900 w-full max-w-lg rounded-2xl overflow-hidden border border-slate-100 dark:border-brand-navy-800 shadow-premium relative z-10 p-6 sm:p-8 transition-colors max-h-[90vh] overflow-y-auto"
          >
            {/* Botón de Cierre Superior Derecha */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-brand-navy-900 dark:hover:text-white rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l18 18" />
              </svg>
            </button>

            {status !== 'success' ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent block mb-1">
                    {language === 'en' ? 'Schedule Tour' : 'Agendar Visita'}
                  </span>
                  <h3 className="text-xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight line-clamp-1">
                    {propertyTitle}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {language === 'en' ? 'Full Name' : 'Nombre Completo'}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full text-sm p-3 rounded-xl border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none focus:border-brand-accent dark:focus:border-brand-accent transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-navy-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        {language === 'en' ? 'Email Address' : 'Correo Electrónico'}
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full text-sm p-3 rounded-xl border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none focus:border-brand-accent dark:focus:border-brand-accent transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-navy-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        {language === 'en' ? 'Phone Number' : 'Número de Teléfono'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full text-sm p-3 rounded-xl border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none focus:border-brand-accent dark:focus:border-brand-accent transition-colors"
                        placeholder="+58 412..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {language === 'en' ? 'Preferred Date' : 'Fecha Preferida'}
                    </label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full text-sm p-3 rounded-xl border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none focus:border-brand-accent dark:focus:border-brand-accent transition-colors color-scheme-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {language === 'en' ? 'Additional Message (Optional)' : 'Mensaje Adicional (Opcional)'}
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full text-sm p-3 rounded-xl border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none focus:border-brand-accent dark:focus:border-brand-accent transition-colors resize-none"
                      placeholder="..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full inline-flex items-center justify-center bg-brand-accent hover:bg-brand-accent-hover text-white py-3.5 rounded-xl text-sm font-bold tracking-wide transition-colors shadow-lg shadow-brand-accent/20 text-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : language === 'en' ? (
                    'Confirm Schedule Request'
                  ) : (
                    'Confirmar Solicitud de Visita'
                  )}
                </button>
              </form>
            ) : (
              /* Pantalla de Éxito Refinada */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight">
                    {language === 'en' ? 'Request Sent Successfully' : 'Solicitud Enviada con Éxito'}
                  </h4>
                  <p className="text-sm text-brand-navy-400 dark:text-slate-400 max-w-sm mx-auto">
                    {language === 'en'
                      ? 'An advisor from the Veluruiz team will contact you shortly to validate your appointment.'
                      : 'Un asesor del equipo de Veluruiz se comunicará contigo a la brevedad para validar tu cita.'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 bg-slate-100 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-colors border border-slate-200 dark:border-brand-navy-700"
                >
                  {language === 'en' ? 'Close Window' : 'Cerrar Ventana'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}