'use client';

import React from 'react';
import { useAppState } from '@/context/AppStateContext';

interface Props {
  status: 'available' | 'sold' | 'rented' | 'pending';
}

export default function PropertyStatusBadge({ status }: Props) {
  const { language } = useAppState();

  const styles = {
    available: 'bg-green-100  text-green-700  border-green-200  dark:bg-green-900/30  dark:text-green-400  dark:border-green-800',
    sold:      'bg-red-100    text-red-700    border-red-200    dark:bg-red-900/30    dark:text-red-400    dark:border-red-800',
    rented:    'bg-blue-100   text-blue-700   border-blue-200   dark:bg-blue-900/30   dark:text-blue-400   dark:border-blue-800',
    pending:   'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  };

  const labels = {
    available: language === 'en' ? 'Available'  : 'Disponible',
    sold:      language === 'en' ? 'Sold'        : 'Vendido',
    rented:    language === 'en' ? 'Rented'      : 'Alquilado',
    pending:   language === 'en' ? 'In Process'  : 'En Trámite',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}