import { db } from "@/lib/db";

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
  }, // <--- Asegúrate de poner una coma aquí

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
};