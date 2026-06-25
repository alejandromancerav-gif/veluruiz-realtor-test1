'use server'; // Crucial: Esto le indica a Next.js que todo este archivo solo corre en el servidor.

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { PropertyStatus } from '@prisma/client';

// Interfaz para validar los datos que entran desde el formulario web
interface CreatePropertyInput {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  city: string;
  zone: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  squareMeters: number;
  type: string;
  operationType: string;
  images: string[];
  amenities: string[];
}

/**
 * 1. CREAR PROPIEDAD
 * Guarda un nuevo inmueble en Supabase y actualiza el catálogo público.
 */
export async function createProperty(data: CreatePropertyInput) {
  try {
    const newProperty = await db.property.create({
      data: {
        ...data,
        status: PropertyStatus.AVAILABLE, // Por defecto, todo inmueble inicia disponible
      },
    });

    // Limpia el caché de la página de catálogo para que aparezca el nuevo inmueble de inmediato
    revalidatePath('/properties');
    return { success: true, property: newProperty };
  } catch (error) {
    console.error('Error creando propiedad:', error);
    return { success: false, error: 'No se pudo crear la propiedad.' };
  }
}

/**
 * 2. LEER PROPIEDADES (CON FILTROS OPCONALES)
 * Trae los inmuebles para el catálogo público o panel de administración.
 */
export async function getProperties(filters?: { type?: string; status?: PropertyStatus }) {
  try {
    const properties = await db.property.findMany({
      where: {
        ...(filters?.type && { type: filters.type }),
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: {
        createdAt: 'desc', // Las más recientes primero
      },
    });
    return { success: true, properties };
  } catch (error) {
    console.error('Error obteniendo propiedades:', error);
    return { success: false, error: 'Error al cargar el catálogo.' };
  }
}

/**
 * 3. ACTUALIZAR ESTADO O DATOS DE PROPIEDAD
 * Permite cambiar precios, descripciones o pasar a SOLD/RENTED.
 */
export async function updateProperty(id: string, data: Partial<CreatePropertyInput> & { status?: PropertyStatus }) {
  try {
    const updated = await db.property.update({
      where: { id },
      data,
    });
    
    revalidatePath('/properties');
    revalidatePath(`/properties/${id}`);
    return { success: true, property: updated };
  } catch (error) {
    console.error('Error actualizando propiedad:', error);
    return { success: false, error: 'No se pudo actualizar el inmueble.' };
  }
}

/**
 * 4. ELIMINAR PROPIEDAD
 * Remueve el inmueble (por efecto cascada borrará también sus citas asociadas).
 */
export async function deleteProperty(id: string) {
  try {
    await db.property.delete({
      where: { id },
    });

    revalidatePath('/properties');
    return { success: true, message: 'Propiedad eliminada correctamente.' };
  } catch (error) {
    console.error('Error eliminando propiedad:', error);
    return { success: false, error: 'No se pudo eliminar la propiedad.' };
  }
}