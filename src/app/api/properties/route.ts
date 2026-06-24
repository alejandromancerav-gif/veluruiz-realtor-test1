import { NextResponse } from "next/server";
import { propertyService } from "@/services/property.service";

// 1. Manejador para listar propiedades
export async function GET() {
  try {
    const properties = await propertyService.getAllProperties();
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener propiedades" }, { status: 500 });
  }
}

// 2. Manejador para crear propiedad
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProperty = await propertyService.createProperty(body);
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error: any) {
    console.error("DEBUG: Error en POST /api/properties:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}