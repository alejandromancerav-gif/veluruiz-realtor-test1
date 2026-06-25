import { db } from "@/lib/db";
import { PropertyUpdateInput } from '@/lib/validations/property';

export const propertyService = {
  async createProperty(data: any) {
    try {
      return await db.property.create({
        data: {
          title: data.title,
          titleEn: data.titleEn || null,
          description: data.description,
          descriptionEn: data.descriptionEn || null,
          price: parseFloat(data.price),
          city: data.city,
          zone: data.zone,
          bedrooms: parseInt(data.bedrooms, 10),
          bathrooms: parseFloat(data.bathrooms),
          parkingSpaces: parseInt(data.parkingSpaces, 10) || 0,
          squareMeters: parseInt(data.squareMeters, 10),
          type: data.type,
          operationType: data.operationType,
          images: data.images || [],
          amenities: data.amenities || [],
        },
      });
    } catch (error) {
      console.error("DEBUG: Error en servicio al crear:", error);
      throw error;
    }
  },

  async getAllProperties() {
    try {
      return await db.property.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error("DEBUG: Error en servicio al listar:", error);
      throw error;
    }
  },

  async getProperties(params: {
    page?: number;
    pageSize?: number;
    operationType?: string;
    type?: string;
    city?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    try {
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 20;
      const skip = (page - 1) * pageSize;

      const where = {
        ...(params.operationType && params.operationType !== 'all' && { operationType: params.operationType }),
        ...(params.type         && params.type         !== 'all' && { type:          params.type }),
        ...(params.city         && params.city          !== 'all' && { city:          params.city }),
        ...((params.minPrice || params.maxPrice) && {
          price: {
            ...(params.minPrice && { gte: params.minPrice }),
            ...(params.maxPrice && { lte: params.maxPrice }),
          },
        }),
        ...(params.search && {
          OR: [
            { title: { contains: params.search, mode: 'insensitive' as const } },
            { zone:  { contains: params.search, mode: 'insensitive' as const } },
            { city:  { contains: params.search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [data, total] = await Promise.all([
        db.property.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
        db.property.count({ where }),
      ]);

      return { data, meta: { page, pageSize, total, hasMore: skip + data.length < total } };
    } catch (error) {
      console.error("DEBUG: Error en servicio al listar paginado:", error);
      throw error;
    }
  },

  async getPropertyFacets() {
    try {
      const [cities, types] = await Promise.all([
        db.property.findMany({ distinct: ['city'], select: { city: true } }),
        db.property.findMany({ distinct: ['type'], select: { type: true } }),
      ]);
      return {
        cities: cities.map(r => r.city),
        types:  types.map(r => r.type),
      };
    } catch (error) {
      console.error("DEBUG: Error en servicio al obtener facets:", error);
      throw error;
    }
  },

  async getChatContext(limit = 30) {
    try {
      return db.property.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          title: true, city: true, price: true, type: true,
          bedrooms: true, bathrooms: true, description: true,
        },
      });
    } catch (error) {
      console.error("DEBUG: Error en servicio al obtener contexto del chat:", error);
      throw error;
    }
  },

  async deleteProperty(id: string) {
    try {
      // 1. Intentamos buscar si existe primero
      const exists = await db.property.findUnique({ where: { id } });
      
      if (!exists) {
        return null; // O devuelve un mensaje de que ya no existe
      }

      // 2. Si existe, procedemos con el borrado
      await db.favorite.deleteMany({ where: { propertyId: id } });
      await db.appointment.deleteMany({ where: { propertyId: id } });
      
      return await db.property.delete({
        where: { id },
      });
    } catch (error) {
      console.error("DEBUG: Error en servicio al eliminar:", error);
      throw error;
    }
  },

  async updateProperty(id: string, data: PropertyUpdateInput) {
    return await db.property.update({
      where: { id },
      data,
    });
  },
};