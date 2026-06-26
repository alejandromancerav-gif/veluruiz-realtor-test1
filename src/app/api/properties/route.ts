import { NextResponse } from "next/server";
import { propertyService } from "@/services/property.service";
import { createClient } from '@/lib/supabase/server';
import { propertySchema } from '@/lib/validations/property';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    let includeAll  = false;
    let onlyPrivate = false;
    const wantsIncludeAll  = searchParams.get('includeAll')  === 'true';
    const wantsOnlyPrivate = searchParams.get('onlyPrivate') === 'true';

    if (wantsIncludeAll || wantsOnlyPrivate) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (wantsIncludeAll) {
          const { data: profile } = await supabase
            .from('profiles').select('role').eq('id', user.id).single();
          if (profile?.role === 'empleado') includeAll = true;
        }
        if (!includeAll && wantsOnlyPrivate) {
          onlyPrivate = true;
        }
      }
    }

    const params = {
      page:          Number(searchParams.get('page') ?? '1'),
      pageSize:      Number(searchParams.get('pageSize') ?? '20'),
      operationType: searchParams.get('operationType') ?? undefined,
      type:          searchParams.get('type') ?? undefined,
      city:          searchParams.get('city') ?? undefined,
      search:        searchParams.get('search') ?? undefined,
      minPrice:      searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice:      searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      includeAll,
      onlyPrivate,
    };
    const result = await propertyService.getProperties(params);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener propiedades" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const parsed = propertySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newProperty = await propertyService.createProperty(parsed.data);
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
