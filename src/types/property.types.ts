// Shape returned by GET /api/properties (list endpoint).
// price and bathrooms are Prisma Decimal fields — they serialize as strings in JSON.
// The individual detail endpoint (GET /api/properties/[id]) converts price to number
// explicitly, but the admin list uses this endpoint and gets strings.
export interface PropertyApiRecord {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  price: string;
  country: string;
  city: string;
  zone: string;
  bedrooms: number;
  bathrooms: string;
  parkingSpaces: number;
  squareMeters: number;
  status: 'AVAILABLE' | 'SOLD' | 'RENTED' | 'PENDING';
  type: string;
  operationType: string;
  images: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  isActive: boolean;
}
