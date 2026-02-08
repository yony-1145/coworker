import { prisma } from '@/lib/prisma';
import { error, success } from '@/lib/apiResponse';

/**
 * スポット重複チェック API
 *
 * 仕様：
 * - 緯度経度をE5で比較、完全一致のスポットがあれば重複判定
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return error('緯度経度が不正です。', 400);
  }

  const latE5 = Math.round(lat * 1e5);
  const lngE5 = Math.round(lng * 1e5);

  // E5一致で重複チェック
  const existing = await prisma.spot.findFirst({
    where: {
      latE5: latE5,
      lngE5: lngE5,
    },
  });

  return success({ exists: !!existing });
}
