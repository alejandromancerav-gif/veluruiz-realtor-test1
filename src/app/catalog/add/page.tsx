// src/app/add/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado unificado del formulario
  const [formData, setFormData] = useState({
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
  });

  // Lista de características disponibles (Amenities)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const amenitiesList = ['Seguridad', 'Tanque de Agua', 'Ascensor', 'Mascotas Permitidas', 'Planta Eléctrica'];

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

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amenities: selectedAmenities,
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || 'Error al guardar la propiedad.');
      }

      // Al guardar con éxito, redireccionamos y refrescamos el catálogo automáticamente
      router.push('/catalog');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-brand-navy-900 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-brand-navy-900 rounded-2xl border border-slate-100 dark:border-brand-navy-800 p-6 shadow-sm">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-brand-navy-900 dark:text-white">Agregar Nueva Propiedad</h1>
            <p className="text-xs text-brand-navy-400 mt-1">Ingresa los datos para guardarlos en Supabase. Las imágenes se rellenarán automáticamente con fotos de prueba.</p>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 text-xs rounded-lg mb-4 font-semibold">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            {/* Título y Tipo de Operación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Título (Español) *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Operación *</label>
                <select name="operationType" value={formData.operationType} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none">
                  <option value="buy">Venta</option>
                  <option value="rent">Alquiler</option>
                </select>
              </div>
            </div>

            {/* Título en Inglés */}
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Título (Inglés - Opcional)</label>
              <input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
            </div>

            {/* Descripciones */}
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Descripción (Español) *</label>
              <textarea required rows={3} name="description" value={formData.description} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none resize-none"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Descripción (Inglés - Opcional)</label>
              <textarea rows={3} name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none resize-none"/>
            </div>

            {/* Precio, Tipo, Ciudad, Zona */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Precio ($) *</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Tipo Inmueble *</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none">
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="land">Terreno</option>
                  <option value="office">Oficina</option>
                  <option value="commercial">Local</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Ciudad *</label>
                <select name="city" value={formData.city} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none">
                  <option value="Caracas">Caracas</option>
                  <option value="Valencia">Valencia</option>
                  <option value="Lechería">Lechería</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Zona / Urbanización *</label>
                <input required type="text" name="zone" placeholder="Ej: Las Mercedes" value={formData.zone} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
              </div>
            </div>

            {/* Atributos numéricos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Habitaciones</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Baños</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Puestos Estac.</label>
                <input type="number" name="parkingSpaces" value={formData.parkingSpaces} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-1">Área Mts²</label>
                <input type="number" name="squareMeters" value={formData.squareMeters} onChange={handleChange} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-brand-navy-800 text-brand-navy-900 dark:text-white border-slate-200 dark:border-brand-navy-700 outline-none"/>
              </div>
            </div>

            {/* Características Generales (Amenities) */}
            <div>
              <label className="block text-xs font-bold text-brand-navy-400 uppercase mb-2">Características Generales</label>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button type="button" key={amenity} onClick={() => handleAmenityToggle(amenity)} className={`px-3 py-1.5 rounded-lg font-semibold text-xs border transition-colors ${isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'bg-slate-50 dark:bg-brand-navy-800 border-slate-200 dark:border-brand-navy-700 text-brand-navy-900 dark:text-slate-300'}`}>
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Listado Privado */}
            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="isPrivate-chk" name="isPrivate" checked={formData.isPrivate} onChange={handleCheckboxChange} className="w-4 h-4 cursor-pointer rounded border-slate-300"/>
              <label htmlFor="isPrivate-chk" className="text-xs font-bold text-brand-navy-500 dark:text-slate-300 cursor-pointer select-none">¿Marcar como Listado Privado? (Oculta las fotos y requiere solicitud)</label>
            </div>

            {/* Botón de Enviar */}
            <div className="pt-4 border-t border-slate-100 dark:border-brand-navy-800 flex justify-end">
              <button disabled={isLoading} type="submit" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-bold rounded-xl transition-colors uppercase tracking-wider text-xs">
                {isLoading ? 'Guardando...' : 'Guardar Propiedad Real'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}