'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/context/AppStateContext';
import ScheduleModal from '@/components/ScheduleModal';

interface ExclusiveProperty {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  price: string;
  city: string;
  zone: string;
  operationType: string;
}

function ExclusiveCard({ property, onSchedule }: { property: ExclusiveProperty; onSchedule: () => void }) {
  const { language } = useAppState();
  const title       = language === 'en' && property.titleEn ? property.titleEn : property.title;
  const description = language === 'en' && property.descriptionEn ? property.descriptionEn : property.description;

  return (
    <div className="bg-white dark:bg-brand-navy-900 rounded-2xl border border-slate-100 dark:border-brand-navy-800 shadow-sm p-6 space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-accent mb-1">
          {property.operationType === 'rent'
            ? (language === 'en' ? 'For Rent' : 'En Alquiler')
            : (language === 'en' ? 'For Sale' : 'En Venta')}
        </p>
        <h3 className="text-lg font-extrabold text-brand-navy-900 dark:text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{property.city} · {property.zone}</p>
      </div>
      <p className="text-xl font-bold text-brand-navy-900 dark:text-white">
        ${Number(property.price).toLocaleString()}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">{description}</p>
      <button
        onClick={onSchedule}
        className="w-full py-3 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-white text-sm font-bold transition-colors"
      >
        {language === 'en' ? 'Request Visit' : 'Solicitar Visita'}
      </button>
    </div>
  );
}

export default function ClientPage() {
  const { language } = useAppState();

  const [properties, setProperties] = useState<ExclusiveProperty[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [selected, setSelected]     = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetch('/api/properties?onlyPrivate=true&pageSize=50')
      .then(r => r.json())
      .then(result => setProperties(result.data ?? []))
      .catch(() => setError(language === 'en' ? 'Error loading listings.' : 'Error al cargar las exclusivas.'))
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSchedule = (property: ExclusiveProperty) => {
    const title = language === 'en' && property.titleEn ? property.titleEn : property.title;
    setSelected({ id: property.id, title });
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-brand-navy-950 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
          {language === 'en' ? 'Loading exclusive listings...' : 'Cargando propiedades exclusivas...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-brand-navy-950 flex items-center justify-center">
        <p className="text-sm font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-navy-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-brand-navy-900 dark:text-white tracking-tight">
            {language === 'en' ? 'Exclusive Listings' : 'Propiedades Exclusivas'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'en'
              ? 'Off-market properties available only to registered clients.'
              : 'Propiedades fuera del mercado disponibles solo para clientes registrados.'}
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-24 text-sm text-slate-400 dark:text-slate-500">
            {language === 'en'
              ? 'No exclusive listings available at this time.'
              : 'No hay propiedades exclusivas disponibles en este momento.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <ExclusiveCard
                key={property.id}
                property={property}
                onSchedule={() => handleSchedule(property)}
              />
            ))}
          </div>
        )}
      </div>

      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelected(null); }}
        propertyTitle={selected?.title ?? ''}
        propertyId={selected?.id}
        language={language}
      />
    </div>
  );
}
