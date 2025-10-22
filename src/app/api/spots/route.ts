import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// --- GET: 一覧 or 検索 ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    const spots = await prisma.spot.findMany({
      where: q
        ? {
            OR: [{ title: { contains: q } }, { description: { contains: q } }],
          }
        : undefined,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        tags: true,
        ratings: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(spots);
  } catch (error: any) {
    console.error('Error fetching spots:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// --- POST: 新規スポット投稿 ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      title,
      description,
      latitude,
      longitude,
      address,
      imageUrls,
      tags,
    } = body;

    const newSpot = await prisma.spot.create({
      data: {
        userId,
        title,
        description,
        latitude,
        longitude,
        address,
        imageUrls,
        // only include tags if they exist
        ...(Array.isArray(tags) && tags.length > 0
          ? {
              tags: {
                connectOrCreate: tags.map((t: string) => ({
                  where: { name: t },
                  create: { name: t },
                })),
              },
            }
          : {}),
      },
      include: { tags: true },
    });

    return NextResponse.json(newSpot, { status: 201 });
  } catch (error: any) {
    console.error('Error creating spot:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
