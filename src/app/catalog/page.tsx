'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '../../components/PropertyCard';
import { Property } from '../../mock-data/properties';

export default function CatalogPage() {
  const { language } = useAppState();

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [facets, setFacets] = useState<{ cities: string[]; types: string[] }>({ cities: [], types: [] });

  const [search, setSearch] = useState<string>('');
  const [operationType, setOperationType] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [city, setCity] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  // Cargar opciones de filtros (ciudades y tipos únicos) — solo una vez al montar
  useEffect(() => {
    fetch('/api/properties/facets')
      .then(r => r.json())
      .then(data => setFacets(data))
      .catch(err => console.error('Error cargando filtros:', err));
  }, []);

  const fetchProperties = async ({ pg = 1, reset = false }: { pg?: number; reset?: boolean } = {}) => {
    if (reset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(pg));
      params.set('pageSize', '20');
      if (operationType !== 'all') params.set('operationType', operationType);
      if (propertyType !== 'all') params.set('type', propertyType);
      if (city !== 'all') params.set('city', city);
      if (search) params.set('search', search);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);

      const response = await fetch(`/api/properties?${params.toString()}`);
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      const result = await response.json();

      if (reset) {
        setProperties(result.data);
      } else {
        setProperties(prev => [...prev, ...result.data]);
      }
      setHasMore(result.meta.hasMore);
      setPage(pg);
    } catch (err: any) {
      console.error("Error cargando catálogo:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Refetch desde página 1 cuando cambian los filtros (también dispara en el mount inicial)
  useEffect(() => {
    fetchProperties({ pg: 1, reset: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, operationType, propertyType, city, minPrice, maxPrice]);

  // Eliminar propiedad de la lista visual tras borrar
  const handleRemoveProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="bg-slate-50 dark:bg-brand-navy-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-slate-200 dark:border-brand-navy-800 pb-5">
          <h1 className="text-3xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight">
            {language === 'en' ? 'Property Catalog' : 'Catálogo de Propiedades'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <aside className="lg:col-span-1 space-y-6">
            <h3 className="font-bold text-brand-navy-900 dark:text-white pb-3 border-b border-slate-200 dark:border-brand-navy-800">
              {language === 'en' ? 'Filters' : 'Filtros'}
            </h3>

            <select className="w-full p-2 border rounded-lg text-sm dark:bg-brand-navy-800 dark:text-white" onChange={(e) => setOperationType(e.target.value)}>
              <option value="all">{language === 'en' ? 'All Operations' : 'Todas las operaciones'}</option>
              <option value="buy">{language === 'en' ? 'Buy' : 'Venta'}</option>
              <option value="rent">{language === 'en' ? 'Rent' : 'Alquiler'}</option>
            </select>

            <select className="w-full p-2 border rounded-lg text-sm dark:bg-brand-navy-800 dark:text-white" onChange={(e) => setPropertyType(e.target.value)}>
              <option value="all">{language === 'en' ? 'All Types' : 'Todos los tipos'}</option>
              {facets.types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select className="w-full p-2 border rounded-lg text-sm dark:bg-brand-navy-800 dark:text-white" onChange={(e) => setCity(e.target.value)}>
              <option value="all">{language === 'en' ? 'All Cities' : 'Todas las ciudades'}</option>
              {facets.cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex gap-2">
              <input type="number" placeholder="Min $" className="w-1/2 p-2 border rounded-lg text-sm dark:bg-brand-navy-800 dark:text-white" onChange={(e) => setMinPrice(e.target.value)} />
              <input type="number" placeholder="Max $" className="w-1/2 p-2 border rounded-lg text-sm dark:bg-brand-navy-800 dark:text-white" onChange={(e) => setMaxPrice(e.target.value)} />
            </div>

          </aside>

          <main className="lg:col-span-3 space-y-6">
            <div className="w-full">
              <input
                type="text"
                placeholder={language === 'en' ? "Search by zone or title..." : "Buscar por zona o título..."}
                className="w-full p-3 border rounded-xl dark:bg-brand-navy-800 dark:text-white text-sm shadow-sm"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {!isLoading && properties.map((prop) => (
                  <motion.div
                    key={prop.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                  >
                    <PropertyCard property={prop} onDelete={handleRemoveProperty} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchProperties({ pg: page + 1 })}
                  disabled={isLoadingMore}
                  className="px-6 py-3 rounded-xl font-bold text-sm border border-slate-200 dark:border-brand-navy-700 text-slate-600 dark:text-slate-300 hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-all duration-300 disabled:opacity-50"
                >
                  {isLoadingMore
                    ? (language === 'en' ? 'Loading...' : 'Cargando...')
                    : (language === 'en' ? 'Load more' : 'Cargar más')}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
