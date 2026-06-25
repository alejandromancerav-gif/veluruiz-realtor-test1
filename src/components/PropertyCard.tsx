'use client';

import React, { useState } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import { Property } from '../mock-data/properties';
import { useAppState } from '../context/AppStateContext';
import FavoriteButton from './FavoriteButton';
import PropertyStatusBadge from './common/PropertyStatusBadge';
import AppointmentModal from './ScheduleModal';

interface PropertyCardProps {
  property: Property;
  onDelete?: (id: string) => void;
}

export default function PropertyCard({ property, onDelete }: PropertyCardProps) {
  const router = useRouter();
  const { language } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(language === 'en' ? "Delete this property?" : "¿Eliminar esta propiedad?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/properties/${property.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete?.(property.id);
      } else {
        alert(language === 'en' ? "Error deleting" : "Error al eliminar");
      }
    } catch (err) { alert("Error"); } finally { setIsDeleting(false); }
  };

  const displayImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : `https://picsum.photos/seed/${property.id}/800/600`;

  return (
    <div className="group relative bg-white dark:bg-brand-navy-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-brand-navy-800 shadow-lg hover:shadow-xl transition-all duration-300">
      
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 font-bold text-xl drop-shadow-md"
        title={language === 'en' ? "Delete" : "Eliminar"}
      >
        {isDeleting ? '...' : '✕'}
      </button>

      <Link href={`/catalog/${property.id}`} className="block relative h-56 w-full overflow-hidden">
        <img src={displayImage} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
          <FavoriteButton propertyId={property.id} />
        </div>
        <div className="absolute top-3 right-12 z-10">
          <PropertyStatusBadge status={property.status} />
        </div>
      </Link>
      
      <div className="p-5">
        <Link href={`/catalog/${property.id}`}>
          <h3 className="font-extrabold text-xl text-brand-navy-900 dark:text-white mb-1 hover:text-amber-600 transition-colors">
            {language === 'en' ? (property.titleEn || property.title) : property.title}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">
          {property.city}, {property.zone}, {property.country}
        </p>

        <p className="text-lg font-bold text-brand-navy-900 dark:text-white mb-4">
          ${property.price?.toLocaleString()}
        </p>
        
        <div className="grid grid-cols-4 gap-2 text-center text-xs text-slate-600 dark:text-slate-400 mb-4 border-y border-slate-100 dark:border-brand-navy-800 py-3">
            <div><span className="block font-bold text-base text-brand-navy-900 dark:text-white">{property.bedrooms ?? 0}</span> Hab</div>
            <div><span className="block font-bold text-base text-brand-navy-900 dark:text-white">{property.bathrooms}</span> Baños</div>
            <div><span className="block font-bold text-base text-brand-navy-900 dark:text-white">{property.parkingSpaces}</span> Puesto</div>
            <div><span className="block font-bold text-base text-brand-navy-900 dark:text-white">{property.squareMeters}</span> m²</div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
          {language === 'en' ? (property.descriptionEn || property.description) : property.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {property.amenities.map((amenity, index) => (
            <span key={index} className="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border bg-slate-100 text-slate-600 dark:bg-brand-navy-800 dark:text-white dark:border-brand-navy-700">
              {amenity}
            </span>
          ))}
        </div>

        <Link 
          href={`/catalog/${property.id}`} 
          className="block w-full text-center py-3 rounded-xl text-sm font-bold border border-slate-200 dark:border-brand-navy-700 text-slate-600 dark:text-slate-300 hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-all duration-300"
        >
            {language === 'en' ? 'View details...' : 'Ver detalle...'}
        </Link>
      </div>

      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} propertyTitle={property.title} propertyId={property.id} language={language} />
    </div>
  );
}