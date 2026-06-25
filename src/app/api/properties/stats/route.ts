import { NextResponse } from 'next/server';
import { propertyService } from '@/services/property.service';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'empleado') return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

    const stats = await propertyService.getPropertyStats();
    return NextResponse.json(stats, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
