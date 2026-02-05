import { prisma } from '@/lib/prisma';
import { error, success } from '@/lib/apiResponse';

/**
 * スポット重複チェック API
 *
 * 仕様：
 * - クエリ: title, lat, lon
 * - 同一タイトルかつ緯度経度が約100m以内に既存スポットがあれば exists: true
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const title = searchParams.get('title');

  if (!title) {
    return error('タイトルが未入力です。', 400);
  }

  // 緯度経度で近いスポットをチェック（±0.001度 ≒ 約100m）
  const existing = await prisma.spot.findFirst({
    where: {
      title: { equals: title, mode: 'insensitive' },
      latitude: { gte: lat - 0.001, lte: lat + 0.001 },
      longitude: { gte: lon - 0.001, lte: lon + 0.001 },
    },
  });

  return success({ exists: !!existing });
}
