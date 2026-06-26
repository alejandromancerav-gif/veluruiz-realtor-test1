'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppState } from '../../../context/AppStateContext';
import FavoriteButton from '../../../components/FavoriteButton';
import ScheduleModal from '../../../components/ScheduleModal';
import PropertyGallery from '../../../components/property-detail/Gallery';
import PropertyStatusBadge from '../../../components/common/PropertyStatusBadge';

interface Property {
  id: string;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  type: string;
  status: "available" | "sold" | "rented" | "pending"; 
  images: string[];
  zone: string;
  city: string;
  country: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  squareMeters?: number | null;
  amenities: string[];
}

export default function PropertyDetailPage() {
  const params = useParams();
  const { language } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const propertyId = typeof params?.id === 'string' ? params.id : '';

  useEffect(() => {
    if (!propertyId) return;

    async function fetchProperty() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/properties/${propertyId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(language === 'en' ? 'Property not found' : 'Propiedad no encontrada');
          }
          throw new Error(language === 'en' ? 'Failed to fetch property' : 'Error al cargar la propiedad');
        }

        const data = await response.json();
        setProperty(data);
      } catch (err: any) {
        console.error("❌ Error cargando detalle:", err);
        setError(err.message || 'Error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty();
  }, [propertyId, language]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-brand-navy-900 flex items-center justify-center">
        <p className="text-sm font-semibold text-brand-navy-400 dark:text-slate-400 animate-pulse">
          {language === 'en' ? 'Loading property specs...' : 'Cargando especificaciones de la propiedad...'}
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-brand-navy-900 flex flex-col items-center justify-center p-6">
        <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          {error || (language === 'en' ? 'Property not found' : 'Propiedad no encontrada')}
        </p>
      </div>
    );
  }

  // Mapeo Dinámico y Seguro de Textos en Base al Idioma Actual
  const title = (language === 'en' && property.titleEn) ? property.titleEn : property.title;
  const description = (language === 'en' && property.descriptionEn) ? property.descriptionEn : property.description;

  // Enlace de WhatsApp dinámico según el idioma seleccionado
  const contactPhone = "584120000000"; 
  const whatsappMessage = language === 'en' 
    ? `Hello Veluruiz Realtor, I am interested in: ${title}`
    : `Hola Veluruiz Realtor, interesado en: ${title}`;
  const whatsappUrl = `https://wa.me/${contactPhone}?text=${encodeURIComponent(whatsappMessage)}`;
  
  // Traducción Dinámica del Tipo de Inmueble (Para la Cabecera)
  const translateType = (type: string) => {
    if (language !== 'en') return type;
    const translations: Record<string, string> = {
      'apartment': 'Apartment', 'apartamento': 'Apartment',
      'house': 'House', 'casa': 'House',
      'land': 'Land Plot', 'terreno': 'Land Plot',
      'office': 'Office', 'oficina': 'Office',
      'commercial': 'Commercial Space', 'local': 'Commercial Space',
      'warehouse': 'Warehouse', 'galpón': 'Warehouse', 'galpon': 'Warehouse'
    };
    return translations[type.toLowerCase()] || type;
  };

  const translateAmenity = (amenity: string) => {
    if (language !== 'en') return amenity;
    const translations: Record<string, string> = {
      'Seguridad': 'Security',
      'Tanque de Agua': 'Water Tank',
      'Ascensor': 'Elevator',
      'Mascotas Permitidas': 'Pet Friendly',
      'Planta Eléctrica': 'Power Generator'
    };
    return translations[amenity] || amenity;
  };

  return (
    <div className="bg-slate-50 dark:bg-brand-navy-900 min-h-screen py-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">

        <div className="bg-white dark:bg-brand-navy-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-brand-navy-800 shadow-sm p-6 space-y-6 transition-colors duration-300">

          {/* GALERÍA DE IMÁGENES */}
          <div className="relative rounded-xl overflow-hidden">
            <PropertyGallery images={property.images} title={title} />
            <div className="absolute top-4 right-4 z-10">
              <FavoriteButton propertyId={property.id} />
            </div>
          </div>

          {/* DETALLES DE CABECERA */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500">
              {translateType(property.type || 'Apartment')}
            </span>
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
              <PropertyStatusBadge status={property.status} />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {property.zone}, {property.city}, {property.country || 'Venezuela'}
            </p>
          </div>

          {/* BARRA DE ATRIBUTOS */}
          <div className="grid grid-cols-4 bg-slate-50 dark:bg-brand-navy-900 rounded-xl py-3 px-2 text-center border border-slate-100 dark:border-brand-navy-800">
            {[
              { label_es: 'Habitaciones', label_en: 'Bedrooms', value: property.bedrooms ?? 0 },
              { label_es: 'Baños', label_en: 'Bathrooms', value: property.bathrooms ?? 0 },
              { label_es: 'Puestos', label_en: 'Parking', value: property.parkingSpaces ?? 0 },
              { label_es: 'Área', label_en: 'Area', value: property.squareMeters ? `${property.squareMeters} m²` : '-' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wide">
                  {language === 'en' ? item.label_en : item.label_es}
                </span>
                <span className="block font-bold text-sm text-slate-800 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* DESCRIPCIÓN */}
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Description' : 'Descripción'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* CARACTERÍSTICAS GENERALES */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'General Features' : 'Características Generales'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities && property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center bg-slate-50 dark:bg-brand-navy-900 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-brand-navy-800 shadow-sm text-slate-700 dark:text-slate-300">
                  <svg className="w-3 h-3 text-slate-800 dark:text-white mr-1.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-xs font-semibold tracking-wide">
                    {translateAmenity(amenity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTONES ACCIÓN */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors shadow-sm text-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.176.012 6.165 1.253 8.413 3.502 2.248 2.25 3.483 5.244 3.484 8.423-.002 6.597-5.339 11.946-11.89 11.946-2.002-.001-3.973-.507-5.722-1.474L0 24zm6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654zm11.11-6.561c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              {language === 'en' ? 'Connect via WhatsApp' : 'Conectar por WhatsApp'}
            </a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white py-3 rounded-xl font-bold transition-colors shadow-sm text-sm"
            >
              <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {language === 'en' ? 'Schedule Inspection Tour' : 'Programar Cita de Inspección'}
            </button>
          </div>

        </div>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyTitle={title}
        propertyId={property.id}
        language={language}
      />
    </div>
  );
}
