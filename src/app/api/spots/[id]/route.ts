import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { error, success } from '@/lib/apiResponse';

/**
 * スポット詳細取得 API
 *
 * 仕様：
 * - 指定IDのスポットを取得
 * - コメント・評価・平均評価を含む
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const spot = await prisma.spot.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        address: true,
        openingHours: true,
        genre: true,
        crowdLevel: true,
        hasWifi: true,
        hasPower: true,
        hasQuietSpace: true,
        hasLargeTable: true,
        hasPhoneCallOK: true,
        hasMeetingSpace: true,
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
      return error('スポットが見つかりません', 404);
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

    return success({ spot: { ...spot, avgRating } });
  } catch (err) {
    console.error(err);
    return error('サーバーエラーが発生しました', 500);
  }
}
