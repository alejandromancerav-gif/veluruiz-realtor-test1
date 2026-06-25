// src/components/AddPropertyModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { PropertyApiRecord } from '@/types/property.types';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  property?: PropertyApiRecord;
}

const DEFAULT_FORM = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  price: '',
  city: 'Caracas',
  zone: '',
  type: 'apartment',
  operationType: 'buy',
  bedrooms: '',
  bathrooms: '',
  parkingSpaces: '',
  squareMeters: '',
  isPrivate: false,
};

export default function AddPropertyModal({ isOpen, onClose, onSuccess, property }: AddPropertyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const amenitiesList = ['Seguridad', 'Tanque de Agua', 'Ascensor', 'Mascotas Permitidas', 'Planta Eléctrica'];

  useEffect(() => {
    if (isOpen) {
      if (property) {
        setFormData({
          title:         property.title,
          titleEn:       property.titleEn ?? '',
          description:   property.description,
          descriptionEn: property.descriptionEn ?? '',
          price:         String(property.price),
          city:          property.city,
          zone:          property.zone,
          type:          property.type,
          operationType: property.operationType,
          bedrooms:      String(property.bedrooms),
          bathrooms:     String(property.bathrooms),
          parkingSpaces: String(property.parkingSpaces),
          squareMeters:  String(property.squareMeters),
          isPrivate:     property.isPrivate,
        });
        setSelectedAmenities(property.amenities ?? []);
      } else {
        setFormData(DEFAULT_FORM);
        setSelectedAmenities([]);
      }
      setError(null);
    }
  }, [isOpen, property?.id]);

  if (!isOpen) return null;

  const isEdit = !!property;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isPrivate: e.target.checked }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const finalTitleEn = formData.titleEn.trim() !== '' ? formData.titleEn : formData.title;
    const finalDescriptionEn = formData.descriptionEn.trim() !== '' ? formData.descriptionEn : formData.description;

    const url    = isEdit ? `/api/properties/${property.id}` : '/api/properties';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          titleEn: finalTitleEn,
          descriptionEn: finalDescriptionEn,
          amenities: selectedAmenities,
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || 'Error al guardar la propiedad.');
      }

      if (!isEdit) {
        setFormData(DEFAULT_FORM);
        setSelectedAmenities([]);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-navy-900 rounded-2xl border border-slate-100 dark:border-brand-navy-800 p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold p-1">
          ✕
        </button>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-brand-navy-900 dark:text-white">
            {isEdit ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}
          </h1>
          <p className="text-xs text-brand-navy-400 mt-1">Ingresa los datos para guardarlos en Supabase con su respectiva traducción.</p>
        </div>

        {error && <div className="p-3 bg-red-100 text-red-700 text-xs rounded-lg mb-4 font-semibold">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Título (Español) *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Título (Inglés)</label>
              <input type="text" name="titleEn" placeholder="Ej: House in La Lagunita" value={formData.titleEn} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Operación *</label>
              <select name="operationType" value={formData.operationType} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none">
                <option value="buy">Venta</option>
                <option value="rent">Alquiler</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Descripción (Español) *</label>
              <textarea required rows={3} name="description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none resize-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Descripción (Inglés)</label>
              <textarea rows={3} name="descriptionEn" placeholder="Ej: Beautiful house with the best view..." value={formData.descriptionEn} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none resize-none"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Precio ($) *</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Tipo Inmueble *</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none">
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="land">Terreno</option>
                <option value="office">Oficina</option>
                <option value="commercial">Local</option>
                <option value="penthouse">Penthouse</option>
                <option value="warehouse">Galpón</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Ciudad *</label>
              <select name="city" value={formData.city} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none">
                <option value="Caracas">Caracas</option>
                <option value="Valencia">Valencia</option>
                <option value="Lechería">Lechería</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Zona / Urbanización *</label>
              <input required type="text" name="zone" placeholder="Ej: Las Mercedes" value={formData.zone} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Habitaciones</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Baños</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Puestos Estac.</label>
              <input type="number" name="parkingSpaces" value={formData.parkingSpaces} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Área Mts²</label>
              <input type="number" name="squareMeters" value={formData.squareMeters} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-2">Características</label>
            <div className="flex flex-wrap gap-1.5">
              {amenitiesList.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button type="button" key={amenity} onClick={() => handleAmenityToggle(amenity)} className={`px-2.5 py-1 rounded-lg font-semibold text-xs border transition-colors ${isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'bg-slate-50 dark:bg-brand-navy-800 border-slate-200 dark:border-brand-navy-700 text-brand-navy-900 dark:text-slate-300'}`}>
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isPrivate" checked={formData.isPrivate} onChange={handleCheckboxChange} className="w-4 h-4 text-amber-600 border-slate-200 dark:border-brand-navy-700 bg-slate-50 dark:bg-brand-navy-800 rounded outline-none cursor-pointer"/>
            <label htmlFor="isPrivate" className="text-xs font-bold text-brand-navy-400 uppercase cursor-pointer select-none">Marcar como propiedad privada / exclusiva</label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-brand-navy-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 dark:border-brand-navy-700 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-brand-navy-800 transition-colors uppercase text-xs">
              Cancelar
            </button>
            <button disabled={isLoading} type="submit" className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-bold rounded-xl transition-colors uppercase text-xs">
              {isLoading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Guardar Propiedad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
