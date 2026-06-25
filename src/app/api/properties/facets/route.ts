import { NextResponse } from 'next/server';
import { propertyService } from '@/services/property.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const facets = await propertyService.getPropertyFacets();
    return NextResponse.json(facets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener filtros' }, { status: 500 });
  }
}
