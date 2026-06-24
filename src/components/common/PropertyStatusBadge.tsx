'use client';

import React from 'react';

interface Props {
  status: 'available' | 'sold' | 'rented' | 'pending';
}

export default function PropertyStatusBadge({ status }: Props) {
  const styles = {
    available: 'bg-green-100 text-green-700 border-green-200',
    sold: 'bg-red-100 text-red-700 border-red-200',
    rented: 'bg-blue-100 text-blue-700 border-blue-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  const labels = {
    available: 'Disponible',
    sold: 'Vendido',
    rented: 'Alquilado',
    pending: 'En Trámite',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}