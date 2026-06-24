import { NextResponse } from "next/server";
import { db } from "@/lib/db";
// Agrega esta línea para importar tu servicio:
import { propertyService } from "@/services/property.service"; 

// ... resto de tu código

// 1. Función GET para cargar el detalle
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const property = await db.property.findUnique({ where: { id: id } });

    if (!property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      ...property,
      price: Number(property.price),
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar la propiedad" }, { status: 500 });
  }
}

// 2. Función DELETE para borrar
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await propertyService.deleteProperty(id);
    return NextResponse.json({ message: "Propiedad eliminada correctamente" }, { status: 200 });
  } catch (error: any) {
    // Esto mostrará el error real en tu terminal
    console.error("DEBUG: Error CRÍTICO en DELETE:", error);
    return NextResponse.json({ 
      error: "No se pudo eliminar",
      details: error.message 
    }, { status: 500 });
  }
}