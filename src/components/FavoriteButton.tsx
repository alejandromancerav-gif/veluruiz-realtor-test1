'use client';

import React from 'react';
import { useFavorites } from '../context/FavoritesContext';

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export default function FavoriteButton({ propertyId, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(propertyId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(propertyId);
      }}
      className={`group flex items-center justify-center p-3 rounded-full border border-slate-200 dark:border-brand-navy-700 bg-white dark:bg-brand-navy-800 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={`w-6 h-6 transition-all duration-300 transform group-hover:scale-110 ${
          active 
            ? 'fill-rose-500 stroke-rose-500' 
            : 'fill-transparent stroke-slate-400 dark:stroke-slate-300 group-hover:stroke-rose-500'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}