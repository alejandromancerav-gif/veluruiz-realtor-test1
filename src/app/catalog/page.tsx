'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import AddPropertyModal from '../../components/AddPropertyModal';
import PropertyCard from '../../components/PropertyCard';
import { Property } from '../../mock-data/properties';

export default function CatalogPage() {
  const { language } = useAppState();

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');
  const [operationType, setOperationType] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [city, setCity] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [onlyPrivate, setOnlyPrivate] = useState<boolean>(false);

  const cities = useMemo(() => Array.from(new Set(properties.map(p => p.city))), [properties]);
  const types = useMemo(() => Array.from(new Set(properties.map(p => p.type))), [properties]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      const data = await response.json();
      setProperties(data);
    } catch (err: any) {
      console.error("Error cargando catálogo:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Función para eliminar de la lista visual
  const handleRemoveProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const currentTitle = language === 'en' && prop.titleEn ? prop.titleEn : prop.title;
      const propTitle = currentTitle ? currentTitle.toLowerCase() : '';
      
      const matchesSearch = propTitle.includes(search.toLowerCase()) || 
                            prop.zone.toLowerCase().includes(search.toLowerCase()) || 
                            prop.city.toLowerCase().includes(search.toLowerCase());
      
      const matchesOperation = operationType === 'all' || prop.operationType === operationType;
      const matchesType = propertyType === 'all' || prop.type === propertyType;
      const matchesCity = city === 'all' || prop.city === city;
      const matchesPrivate = !onlyPrivate || prop.isPrivate;
      
      const price = prop.price || 0;
      const matchesMinPrice = minPrice === '' || price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || price <= Number(maxPrice);

      return matchesSearch && matchesOperation && matchesType && matchesCity && matchesPrivate && matchesMinPrice && matchesMaxPrice;
    });
  }, [properties, search, operationType, propertyType, city, minPrice, maxPrice, onlyPrivate, language]);

  return (
    <div className="bg-slate-50 dark:bg-brand-navy-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-slate-200 dark:border-brand-navy-800 pb-5">
          <h1 className="text-3xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight">
            {language === 'en' ? 'Property Catalog' : 'Catálogo de Propiedades'}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all duration-200"
          >
            + {language === 'en' ? 'Add Property' : 'Agregar Propiedad'}
          </button>
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
              {types.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>

            <select className="w-full p-2 border rounded-lg text-sm dark:bg-brand-navy-800 dark:text-white" onChange={(e) => setCity(e.target.value)}>
              <option value="all">{language === 'en' ? 'All Cities' : 'Todas las ciudades'}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex gap-2">
              <input type="number" placeholder="Min $" className="w-1/2 p-2 border rounded-lg text-sm dark:bg-brand-navy-800 dark:text-white" onChange={(e) => setMinPrice(e.target.value)} />
              <input type="number" placeholder="Max $" className="w-1/2 p-2 border rounded-lg text-sm dark:bg-brand-navy-800 dark:text-white" onChange={(e) => setMaxPrice(e.target.value)} />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" onChange={(e) => setOnlyPrivate(e.target.checked)} />
              {language === 'en' ? 'Only Private' : 'Solo Privadas'}
            </label>
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
                {!isLoading && filteredProperties.map((prop) => (
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
          </main>
        </div>
      </div>

      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchProperties();
        }} 
      />
    </div>
  );
}