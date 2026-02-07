import { prisma } from '@/lib/prisma';
import { error, success } from '@/lib/apiResponse';

/**
 * スポット重複チェック API
 *
 * 仕様：
 * - クエリ: lat, lon（titleは無視）
 * - 緯度経度をE5に丸め、完全一致のスポットがあれば exists: true
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return error('緯度経度が不正です。', 400);
  }

  const latE5 = Math.round(lat * 1e5);
  const lngE5 = Math.round(lon * 1e5);

  // E5一致で重複チェック
  const existing = await prisma.spot.findFirst({
    where: {
      latE5: latE5,
      lngE5: lngE5,
    },
  });

  return success({ exists: !!existing });
}
