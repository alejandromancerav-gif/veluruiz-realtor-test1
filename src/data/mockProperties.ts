import { Property } from '../types/property';

export const mockProperties: Property[] = [
  {
    id: '123',
    title: {
      es: 'Apartamento Familiar Confortable',
      en: 'Comfortable Family Apartment'
    },
    description: {
      es: 'Hermoso apartamento ubicado en una zona residencial exclusiva con excelente conectividad.',
      en: 'Beautiful apartment located in an exclusive residential area with excellent connectivity.'
    },
    price: 320000,
    beds: 3,
    baths: 2,
    parking: 1, // Standardized across all entries
    area: 95,
    location: {
      es: 'Bella Vista, Santo Domingo',
      en: 'Bella Vista, Santo Domingo'
    },
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  }
];