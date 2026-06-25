import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  titleEn: z.string().optional(),
  description: z.string().min(20, "La descripción es muy corta"),
  descriptionEn: z.string().optional(), // Asegúrate de añadir esto si lo tienes en el prisma
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  country: z.string().default("Venezuela"),
  city: z.string().min(2, "Ciudad requerida"),
  zone: z.string().min(2, "Zona requerida"),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  parkingSpaces: z.coerce.number().int().min(0).default(0), // Asegúrate de que coincida con Prisma
  squareMeters: z.coerce.number().positive(),
  status: z.enum(["AVAILABLE", "SOLD", "RENTED", "PENDING"]).default("AVAILABLE"),
  type: z.string().min(1, "El tipo de propiedad es obligatorio"),
  operationType: z.string().min(1, "El tipo de operación es obligatorio"), // <--- ESTO FALTABA
  images: z.array(z.string().url()).min(1, "Al menos una imagen es requerida"),
  amenities: z.array(z.string()).default([]),
});

export type PropertyInput = z.infer<typeof propertySchema>;

export const propertyUpdateSchema = propertySchema.partial().extend({
  isPrivate: z.boolean().optional(),
  isActive:  z.boolean().optional(),
});

export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;