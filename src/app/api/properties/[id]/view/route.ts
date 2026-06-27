import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

const BOT_UA = /bot|crawler|spider|googlebot|bingbot|ahrefsbot/i;

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ua = request.headers.get('user-agent') ?? '';
  if (BOT_UA.test(ua)) {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  const { id } = params;

  try {
    await db.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    console.error('[POST /view] Unexpected error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
