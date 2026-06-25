import { NextResponse } from "next/server";
import { propertyService } from "@/services/property.service";

// 1. Manejador para listar propiedades (paginado + filtrado)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page:          Number(searchParams.get('page') ?? '1'),
      pageSize:      Number(searchParams.get('pageSize') ?? '20'),
      operationType: searchParams.get('operationType') ?? undefined,
      type:          searchParams.get('type') ?? undefined,
      city:          searchParams.get('city') ?? undefined,
      search:        searchParams.get('search') ?? undefined,
      minPrice:      searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice:      searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    };
    const result = await propertyService.getProperties(params);
    return NextResponse.json(result, { status: 200 });
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