import { z } from 'zod';

export const appointmentSchema = z.object({
  propertyId:    z.string().uuid().optional().nullable(),
  clientName:    z.string().min(2, 'Nombre requerido'),
  clientEmail:   z.string().email('Email inválido'),
  clientPhone:   z.string().min(7, 'Teléfono requerido'),
  preferredDate: z.coerce.date(),
  notes:         z.string().optional().nullable(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
