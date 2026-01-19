import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const spot = await prisma.spot.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrls: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: { id: true, name: true, image: true },
        },
        tags: {
          select: { name: true },
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        ratings: {
          select: {
            id: true,
            score: true,
            createdAt: true,
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    if (!spot) {
      return NextResponse.json(
        { ok: false, error: { code: 'NOT_FOUND', message: 'Not found' } },
        { status: 404 },
      );
    }

    const avgRating =
      spot.ratings.length > 0
        ? Number(
            (
              spot.ratings.reduce((sum, r) => sum + r.score, 0) /
              spot.ratings.length
            ).toFixed(1),
          )
        : null;

    return NextResponse.json({
      ok: true,
      spot: { ...spot, avgRating },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
        },
      },
      { status: 500 },
    );
  }
}
