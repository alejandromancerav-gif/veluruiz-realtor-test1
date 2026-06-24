'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos el estado desde el localStorage directamente si es posible
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Leemos una sola vez al montar
    const stored = localStorage.getItem('veluruiz_favs');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Error al cargar favoritos', e);
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo guardamos si ya se realizó la carga inicial para no sobreescribir con un array vacío
    if (isMounted) {
      localStorage.setItem('veluruiz_favs', JSON.stringify(favorites));
    }
  }, [favorites, isMounted]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
}