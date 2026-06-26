'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface AppStateContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LANGUAGE_KEY = 'language';

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    try {
      return (localStorage.getItem(LANGUAGE_KEY) as Language) ?? 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem(LANGUAGE_KEY, lang); } catch {}
  };

  return (
    <AppStateContext.Provider value={{ language, setLanguage }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState debe ser usado dentro de un AppStateProvider');
  }
  return context;
}