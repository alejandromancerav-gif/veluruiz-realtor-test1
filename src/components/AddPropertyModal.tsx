// src/components/AddPropertyModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { PropertyApiRecord } from '@/types/property.types';
import { useAppState } from '@/context/AppStateContext';

interface UploadSlot {
  id: string;
  status: 'uploading' | 'error';
  errorMsg?: string;
}

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
  type: 'Apartamento',
  operationType: 'buy',
  bedrooms: '',
  bathrooms: '',
  parkingSpaces: '',
  squareMeters: '',
  isPrivate: false,
};

const amenitiesList = ['Seguridad', 'Tanque de Agua', 'Ascensor', 'Mascotas Permitidas', 'Planta Eléctrica'];

const amenityLabelsEn: Record<string, string> = {
  'Seguridad':           'Security',
  'Tanque de Agua':      'Water Tank',
  'Ascensor':            'Elevator',
  'Mascotas Permitidas': 'Pets Allowed',
  'Planta Eléctrica':    'Generator',
};

export default function AddPropertyModal({ isOpen, onClose, onSuccess, property }: AddPropertyModalProps) {
  const { language } = useAppState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadSlots, setUploadSlots]       = useState<UploadSlot[]>([]);

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
        setUploadedImages(property.images ?? []);
        setUploadSlots([]);
      } else {
        setFormData(DEFAULT_FORM);
        setSelectedAmenities([]);
        setUploadedImages([]);
        setUploadSlots([]);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const slotId = crypto.randomUUID();
    setUploadSlots(prev => [...prev, { id: slotId, status: 'uploading' }]);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/properties/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) {
        setUploadSlots(prev => prev.map(s =>
          s.id === slotId ? { ...s, status: 'error', errorMsg: data.error ?? (language === 'en' ? 'Upload error' : 'Error al subir') } : s
        ));
        return;
      }
      setUploadSlots(prev => prev.filter(s => s.id !== slotId));
      setUploadedImages(prev => [...prev, data.url]);
    } catch {
      setUploadSlots(prev => prev.map(s =>
        s.id === slotId ? { ...s, status: 'error', errorMsg: language === 'en' ? 'Connection error' : 'Error de conexión' } : s
      ));
    }
  };

  const handleRemoveImage  = (url: string)    => setUploadedImages(prev => prev.filter(u => u !== url));
  // El archivo queda como huérfano en Supabase Storage — cleanup pendiente en Lote 7
  const handleDismissError = (slotId: string) => setUploadSlots(prev => prev.filter(s => s.id !== slotId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (uploadSlots.some(s => s.status === 'uploading')) {
      setError(language === 'en' ? 'Wait for all images to finish uploading' : 'Espera a que terminen de subir todas las imágenes');
      setIsLoading(false);
      return;
    }
    if (uploadedImages.length === 0) {
      setError(language === 'en' ? 'At least one image is required' : 'Al menos una imagen es requerida');
      setIsLoading(false);
      return;
    }

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
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || (language === 'en' ? 'Error saving the property.' : 'Error al guardar la propiedad.'));
      }

      if (!isEdit) {
        setFormData(DEFAULT_FORM);
        setSelectedAmenities([]);
        setUploadedImages([]);
        setUploadSlots([]);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : null) || (language === 'en' ? 'An unexpected error occurred' : 'Ocurrió un error inesperado'));
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || uploadSlots.some(s => s.status === 'uploading');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-navy-900 rounded-2xl border border-slate-100 dark:border-brand-navy-800 p-6 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold p-1">
          ✕
        </button>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-brand-navy-900 dark:text-white">
            {isEdit
              ? (language === 'en' ? 'Edit Property' : 'Editar Propiedad')
              : (language === 'en' ? 'Add New Property' : 'Agregar Nueva Propiedad')}
          </h1>
          <p className="text-xs text-brand-navy-400 mt-1">
            {language === 'en'
              ? 'Enter the property details to store them with their respective translation.'
              : 'Ingresa los datos para guardarlos en Supabase con su respectiva traducción.'}
          </p>
        </div>

        {error && <div className="p-3 bg-red-100 text-red-700 text-xs rounded-lg mb-4 font-semibold">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Title (Spanish) *' : 'Título (Español) *'}
              </label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Title (English)' : 'Título (Inglés)'}
              </label>
              <input type="text" name="titleEn" placeholder="Ej: House in La Lagunita" value={formData.titleEn} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Operation *' : 'Operación *'}
              </label>
              <select name="operationType" value={formData.operationType} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none">
                <option value="buy">{language === 'en' ? 'Sale' : 'Venta'}</option>
                <option value="rent">{language === 'en' ? 'Rent' : 'Alquiler'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Description (Spanish) *' : 'Descripción (Español) *'}
              </label>
              <textarea required rows={3} name="description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none resize-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Description (English)' : 'Descripción (Inglés)'}
              </label>
              <textarea rows={3} name="descriptionEn" placeholder="Ej: Beautiful house with the best view..." value={formData.descriptionEn} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none resize-none"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Price ($) *' : 'Precio ($) *'}
              </label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Property Type *' : 'Tipo Inmueble *'}
              </label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none">
                <option value="Apartamento">{language === 'en' ? 'Apartment'         : 'Apartamento'}</option>
                <option value="Casa">       {language === 'en' ? 'House'             : 'Casa'}</option>
                <option value="Terreno">    {language === 'en' ? 'Land'              : 'Terreno'}</option>
                <option value="Oficina">    {language === 'en' ? 'Office'            : 'Oficina'}</option>
                <option value="Local Comercial">{language === 'en' ? 'Commercial Space' : 'Local Comercial'}</option>
                <option value="Penthouse">  Penthouse</option>
                <option value="Galpón">     {language === 'en' ? 'Warehouse'         : 'Galpón'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'City *' : 'Ciudad *'}
              </label>
              <select name="city" value={formData.city} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none">
                <option value="Caracas">Caracas</option>
                <option value="Valencia">Valencia</option>
                <option value="Lechería">Lechería</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Zone / Neighborhood *' : 'Zona / Urbanización *'}
              </label>
              <input required type="text" name="zone" placeholder="Ej: Las Mercedes" value={formData.zone} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Bedrooms' : 'Habitaciones'}
              </label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Bathrooms' : 'Baños'}
              </label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Parking' : 'Puestos Estac.'}
              </label>
              <input type="number" name="parkingSpaces" value={formData.parkingSpaces} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">
                {language === 'en' ? 'Area Sqm' : 'Área Mts²'}
              </label>
              <input type="number" name="squareMeters" value={formData.squareMeters} onChange={handleChange} className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-2">
              {language === 'en' ? 'Amenities' : 'Características'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {amenitiesList.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                const label = language === 'en' ? (amenityLabelsEn[amenity] ?? amenity) : amenity;
                return (
                  <button type="button" key={amenity} onClick={() => handleAmenityToggle(amenity)} className={`px-2.5 py-1 rounded-lg font-semibold text-xs border transition-colors ${isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'bg-slate-50 dark:bg-brand-navy-800 border-slate-200 dark:border-brand-navy-700 text-brand-navy-900 dark:text-slate-300'}`}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-2">
              {language === 'en' ? 'Images *' : 'Imágenes *'}
            </label>

            {(uploadedImages.length > 0 || uploadSlots.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {uploadedImages.map((url) => (
                  <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-brand-navy-700 flex-shrink-0">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
                    >✕</button>
                  </div>
                ))}
                {uploadSlots.map((slot) => (
                  <div key={slot.id} className="w-20 h-20 rounded-lg border border-slate-200 dark:border-brand-navy-700 flex-shrink-0 flex items-center justify-center bg-slate-50 dark:bg-brand-navy-800 p-1">
                    {slot.status === 'uploading' ? (
                      <span className="text-[10px] text-slate-400 text-center">
                        {language === 'en' ? 'Uploading...' : 'Subiendo...'}
                      </span>
                    ) : (
                      <div className="text-center">
                        <span className="text-[10px] text-red-500 block leading-tight">{slot.errorMsg}</span>
                        <button type="button" onClick={() => handleDismissError(slot.id)} className="text-[10px] text-slate-400 hover:text-slate-600 mt-0.5">
                          {language === 'en' ? 'Dismiss' : 'Cerrar'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-brand-navy-700 text-xs font-semibold text-brand-navy-900 dark:text-slate-300 bg-slate-50 dark:bg-brand-navy-800 hover:bg-slate-100 dark:hover:bg-brand-navy-700 cursor-pointer transition-colors">
              {language === 'en' ? '+ Add image' : '+ Agregar imagen'}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isPrivate" checked={formData.isPrivate} onChange={handleCheckboxChange} className="w-4 h-4 text-amber-600 border-slate-200 dark:border-brand-navy-700 bg-slate-50 dark:bg-brand-navy-800 rounded outline-none cursor-pointer"/>
            <label htmlFor="isPrivate" className="text-xs font-bold text-brand-navy-400 uppercase cursor-pointer select-none">
              {language === 'en' ? 'Mark as private / exclusive listing' : 'Marcar como propiedad privada / exclusiva'}
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-brand-navy-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 dark:border-brand-navy-700 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-brand-navy-800 transition-colors uppercase text-xs">
              {language === 'en' ? 'Cancel' : 'Cancelar'}
            </button>
            <button disabled={isSubmitDisabled} type="submit" className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-bold rounded-xl transition-colors uppercase text-xs">
              {isLoading
                ? (language === 'en' ? 'Saving...' : 'Guardando...')
                : isEdit
                  ? (language === 'en' ? 'Save Changes' : 'Guardar Cambios')
                  : (language === 'en' ? 'Save Property' : 'Guardar Propiedad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
