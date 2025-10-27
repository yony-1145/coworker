import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // params.id を使ってスポット情報を取得
    const spot = await prisma.spot.findUnique({
      where: { id: params.id },
      include: {
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
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 平均スコアを算出（小数1桁）
    const avgRating =
      spot.ratings.length > 0
        ? Number(
            (
              spot.ratings.reduce((sum, r) => sum + r.score, 0) /
              spot.ratings.length
            ).toFixed(1)
          )
        : null;

    return NextResponse.json({ ...spot, avgRating });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
