import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

const patchSchema = z.object({
  status: z.enum(['pending', 'scheduled', 'pending_approval', 'denied']),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'empleado') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Estado inválido', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await db.appointment.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });

    const updated = await db.appointment.update({
      where: { id: params.id },
      data:  { status: parsed.data.status },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar la solicitud' }, { status: 500 });
  }
}
