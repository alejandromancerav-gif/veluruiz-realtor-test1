'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../context/AppStateContext';

export default function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false);

  const { language } = useAppState();

  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        language === 'en'
          ? 'Hello! I am your VeluRuiz AI real estate assistant. How can I help you today?'
          : '¡Hola! Soy tu asistente inmobiliario de VeluRuiz. ¿Cómo puedo ayudarte hoy?',
    },
  ]);

  const [input, setInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // MENSAJE USUARIO
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    // NUEVO HISTORIAL COMPLETO
    const updatedMessages = [...messages, userMsg];

    // MOSTRAR EN CHAT
    setMessages(updatedMessages);

    // LIMPIAR INPUT
    setInput('');

    // LOADING
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        // ENVIAR TODO EL HISTORIAL
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      console.log(data);

      // RESPUESTA IA
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.text,
          },
        ]);
      }

      // ERROR BACKEND
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content:
              language === 'en'
                ? 'Sorry, something went wrong.'
                : 'Lo siento, ocurrió un error.',
          },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            language === 'en'
              ? 'Server connection error.'
              : 'Error de conexión con el servidor.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 bg-white dark:bg-brand-navy-900 border border-slate-200 dark:border-brand-navy-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* HEADER */}
            <div className="bg-brand-navy-900 dark:bg-brand-navy-800 p-4 flex justify-between items-center border-b border-brand-navy-800 dark:border-brand-navy-700">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isLoading
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-green-500'
                  }`}
                ></div>

                <h3 className="text-white font-bold text-sm">
                  {language === 'en'
                    ? 'VeluRuiz AI Assistant'
                    : 'Asistente VeluRuiz'}
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* MENSAJES */}
            <div className="flex-grow p-4 overflow-y-auto bg-slate-50 dark:bg-[#0b1121] space-y-4">
              {messages.map((m: any) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                      m.role === 'user'
                        ? 'bg-amber-600 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-brand-navy-800 border border-slate-100 dark:border-brand-navy-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {/* LOADING */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl text-sm bg-white dark:bg-brand-navy-800 border border-slate-100 dark:border-brand-navy-700 text-slate-800 dark:text-slate-200 rounded-tl-sm">
                    {language === 'en'
                      ? 'Typing...'
                      : 'Escribiendo...'}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 border-t border-slate-200 dark:border-brand-navy-800 bg-white dark:bg-brand-navy-900">
              <form className="flex gap-2" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Type your question...'
                      : 'Escribe tu pregunta...'
                  }
                  className="flex-grow p-3 text-sm border rounded-xl dark:bg-brand-navy-800 dark:border-brand-navy-700 dark:text-white outline-none focus:border-amber-600 dark:focus:border-amber-600 transition-colors shadow-inner"
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:hover:bg-amber-600 text-white p-3 rounded-xl transition-colors shadow-md flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105 focus:outline-none flex items-center justify-center"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}