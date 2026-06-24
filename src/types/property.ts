export interface Property {
  id: string;
  title: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  price: number;
  beds: number;
  baths: number;
  parking: number; // Standardized field name
  area: number;    // Represented in square meters
  location: {
    es: string;
    en: string;
  };
  image: string;
  featured?: boolean;
}