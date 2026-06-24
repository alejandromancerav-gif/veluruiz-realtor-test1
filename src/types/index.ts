export interface Location {
  country: string;
  city: string;
  zone: string;
  address?: string; // Opcional por privacidad
}

export interface Property {
  id: string;
  title: string;
  type: 'luxury-home' | 'apartment' | 'office' | 'commercial' | 'warehouse' | 'building' | 'land' | 'villa';
  status: 'sale' | 'rent';
  location: Location;
  price?: number; // Opcional si es listing exclusivo (Price on Application)
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  sizeSquareMeters: number;
  images: string[];
  isExclusive: boolean; // TRUE oculta fotos exactas y activa el CTA premium
  amenities: string[];
  description: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
}

export interface FilterState {
  status: 'sale' | 'rent';
  propertyType: string;
  city: string;
  zone: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  amenities: string[];
}