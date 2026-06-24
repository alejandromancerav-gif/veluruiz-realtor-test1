'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface AppStateContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es'); // Por defecto en español

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