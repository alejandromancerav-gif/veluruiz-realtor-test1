'use client';

import React, { useState } from 'react';

interface GalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Verificación de seguridad básica
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[450px] bg-slate-200 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400">
        No hay imágenes disponibles
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full h-[450px] bg-slate-200 dark:bg-slate-900">
      {/* Usamos el índice actual directamente para renderizar la imagen */}
      <img 
        key={currentIndex} 
        src={images[currentIndex]} 
        alt={`${title} - ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-all duration-500 ease-in-out"
      />

      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage} 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition z-20"
          >
            ❮
          </button>
          <button 
            onClick={nextImage} 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition z-20"
          >
            ❯
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}