import { NextResponse } from 'next/server';
import { appointmentService } from '@/services/appointment.services';
import { propertyService } from '@/services/property.service';
import { appointmentSchema } from '@/lib/validations/appointment';
import { createClient } from '@/lib/supabase/server';

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 3_600_000;

export async function GET(request: Request) {
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

  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page:     Number(searchParams.get('page')     ?? '1'),
      pageSize: Number(searchParams.get('pageSize') ?? '25'),
    };
    const result = await appointmentService.getAppointments(params);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (entry && now - entry.windowStart < RATE_LIMIT_WINDOW_MS) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta más tarde.' },
        { status: 429 }
      );
    }
    entry.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
  }

  try {
    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    let status   = 'pending';
    let clientId: string | null = null;

    if (parsed.data.propertyId) {
      const property = await propertyService.getPropertyById(parsed.data.propertyId, true);
      if (!property || !property.isActive) {
        return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
      }
      if (property.isPrivate) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return NextResponse.json(
            { error: 'Inicia sesión para solicitar una visita a esta propiedad' },
            { status: 401 }
          );
        }
        clientId = user.id;
        status   = 'pending_approval';
      }
    }

    const appointment = await appointmentService.createAppointment({
      ...parsed.data,
      clientId,
      status,
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar la solicitud' }, { status: 500 });
  }
}
