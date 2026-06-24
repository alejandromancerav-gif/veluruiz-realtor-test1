export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending';

export interface Property {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  type: 'house' | 'apartment' | 'office' | 'commercial' | 'warehouse' | 'land' | 'building';
  operationType: 'buy' | 'rent';
  country: string;
  city: string;
  zone: string;
  bedrooms?: number;
  bathrooms: number;
  parkingSpaces: number;
  squareMeters: number;
  price?: number; 
  amenities: string[];
  images: string[];
  isPrivate: boolean;
  featured: boolean;
  createdAt: string;
  status: PropertyStatus;
}

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    title: 'Apartamento Familiar Confortable',
    titleEn: 'Comfortable Family Apartment',
    description: 'Excelente iluminación natural, ubicado en zona residencial tranquila con acceso directo a comercios y transporte.',
    descriptionEn: 'Excellent natural lighting, located in a quiet residential area with direct access to shops and transport.',
    type: 'apartment',
    operationType: 'buy',
    country: 'Venezuela',
    city: 'Caracas',
    zone: 'El Cafetal',
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    squareMeters: 95,
    price: 65000,
    amenities: ['Seguridad', 'Tanque de Agua', 'Ascensor', 'Mascotas Permitidas'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80'
    ],
    isPrivate: false,
    featured: true,
    createdAt: '2026-01-15',
    status: 'available'
  },
  {
    id: 'prop-2',
    title: 'Exclusiva Quinta en Zona Segura',
    titleEn: 'Exclusive Villa in a Secure Area',
    description: 'Residencia de alto nivel con estrictas medidas de privacidad, amplias áreas verdes y acabados de primera calidad.',
    descriptionEn: 'High-end residence with strict privacy measures, large green areas, and premium finishes.',
    type: 'house',
    operationType: 'buy',
    country: 'Venezuela',
    city: 'Caracas',
    zone: 'La Lagunita',
    bedrooms: 5,
    bathrooms: 6,
    parkingSpaces: 4,
    squareMeters: 650,
    amenities: ['Piscina', 'Seguridad', 'Planta Eléctrica', 'Terraza', 'Vista Panorámica'],
    images: [],
    isPrivate: true,
    featured: true,
    createdAt: '2026-02-10',
    status: 'available'
  },
  {
    id: 'prop-3',
    title: 'Local Comercial Estratégico',
    titleEn: 'Strategic Commercial Space',
    description: 'Ideal para franquicias o tiendas de alto tráfico, excelente vitrina a pie de calle en avenida principal.',
    descriptionEn: 'Ideal for franchises or high-traffic stores, excellent street-level display on a main avenue.',
    type: 'commercial',
    operationType: 'rent',
    country: 'Venezuela',
    city: 'Lechería',
    zone: 'Av. Principal',
    bathrooms: 1,
    parkingSpaces: 2,
    squareMeters: 45,
    price: 1200,
    amenities: ['Seguridad', 'Estacionamiento Clientes'],
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    isPrivate: false,
    featured: false,
    createdAt: '2026-03-01',
    status: 'rented'
  },
  {
    id: 'prop-4',
    title: 'Apartamento Compacto y Moderno',
    titleEn: 'Modern Compact Apartment',
    description: 'Perfecto para ejecutivos o parejas jóvenes. Acabados minimalistas y excelente ubicación urbana.',
    descriptionEn: 'Perfect for executives or young couples. Minimalist finishes and excellent urban location.',
    type: 'apartment',
    operationType: 'rent',
    country: 'Venezuela',
    city: 'Valencia',
    zone: 'El Viñedo',
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    squareMeters: 55,
    price: 450,
    amenities: ['Ascensor', 'Gimnasio', 'Seguridad', 'Amoblado'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672023413-75a7ce9b936d?w=800&auto=format&fit=crop&q=80'
    ],
    isPrivate: false,
    featured: false,
    createdAt: '2026-03-12',
    status: 'pending'
  }
];