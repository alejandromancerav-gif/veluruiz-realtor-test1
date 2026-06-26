'use client';

import React, { useState, useEffect } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { useAppState } from '../../context/AppStateContext';
import { mockProperties } from '../../mock-data/properties';
import PropertyCard from '../../components/PropertyCard';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { language } = useAppState();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  const favoriteItems = mockProperties.filter((item) => favorites.includes(item.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-navy-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-brand-navy-900 dark:text-white mb-8">
          {language === 'en' ? 'My Favorites' : 'Mis Favoritos'}
        </h1>
        
        {favoriteItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteItems.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 dark:text-slate-400">
            {language === 'en' ? 'No favorites yet.' : 'No tienes favoritos aún.'}
          </div>
        )}
      </div>
    </div>
  );
}