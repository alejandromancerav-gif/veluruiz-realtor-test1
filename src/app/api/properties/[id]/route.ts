import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { propertyService } from "@/services/property.service";
import { createClient } from '@/lib/supabase/server';
import { propertyUpdateSchema } from '@/lib/validations/property';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const property = await propertyService.getPropertyById(id);

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

export async function PATCH(
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

    const body = await request.json();
    const parsed = propertyUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id } = params;
    const existing = await db.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }

    const updated = await propertyService.updateProperty(id, parsed.data);
    return NextResponse.json({ ...updated, price: Number(updated.price) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar la propiedad' }, { status: 500 });
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
