// src/app/api/webhooks/calendly/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 1. Tu función para guardar en la base de datos se queda aquí adentro
async function createAppointmentInDB(data: {
  propertyId?: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: Date;
  calendlyUri?: string | null;
  status: string;
}) {
  const createPayload: any = {
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone,
    preferredDate: data.preferredDate,
    calendlyUri: data.calendlyUri || null,
    status: data.status,
  };

  if (data.propertyId) {
    createPayload.property = { connect: { id: data.propertyId } };
  }

  return await db.appointment.create({
    data: createPayload,
  });
}

// 2. Exportamos el método POST que Next.js necesita obligatoriamente
export async function POST(request: Request) {
  try {
    // Dejamos el endpoint respondiendo un 200 exitoso.
    // Más adelante, cuando retomemos Calendly, aquí procesaremos el "request.json()"
    // y llamaremos a la función createAppointmentInDB.
    return NextResponse.json(
      { message: "Webhook de Calendly listo y en pausa" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en el webhook de Calendly:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}