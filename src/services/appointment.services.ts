// src/services/appointment.services.ts
import { db } from "@/lib/db";

export const appointmentService = {
  async createAppointment(data: {
    propertyId?: string | null;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    preferredDate: Date;
    notes?: string | null;
    calendlyUri?: string | null;
    status: string;
  }) {
    const createPayload: any = {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      preferredDate: data.preferredDate,
      notes: data.notes || null,
      calendlyUri: data.calendlyUri || null,
      status: data.status,
    };

    if (data.propertyId) {
      createPayload.property = { connect: { id: data.propertyId } };
    }

    return await db.appointment.create({
      data: createPayload,
    });
  },

  async getAppointments(params: { page?: number; pageSize?: number } = {}) {
    const page     = params.page     ?? 1;
    const pageSize = params.pageSize ?? 25;
    const skip     = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.appointment.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { property: { select: { id: true, title: true } } },
      }),
      db.appointment.count(),
    ]);

    return { data, meta: { page, pageSize, total, hasMore: skip + data.length < total } };
  },
};