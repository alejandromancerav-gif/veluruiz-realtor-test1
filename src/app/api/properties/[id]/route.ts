import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { propertyService } from "@/services/property.service";
import { createClient } from '@/lib/supabase/server';

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'empleado') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id } = params;
    await propertyService.deleteProperty(id);
    return NextResponse.json({ message: "Propiedad eliminada correctamente" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });
  }
}
