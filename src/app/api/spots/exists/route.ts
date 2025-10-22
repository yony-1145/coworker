import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json(
      { error: 'タイトルが未入力です。' },
      { status: 400 }
    );
  }

  // 緯度経度で近いスポットをチェック（±0.001度 ≒ 約100m）
  const existing = await prisma.spot.findFirst({
    where: {
      title: { equals: title, mode: 'insensitive' },
      latitude: { gte: lat - 0.001, lte: lat + 0.001 },
      longitude: { gte: lon - 0.001, lte: lon + 0.001 },
    },
  });

  return NextResponse.json({ exists: !!existing });
}
