import { prisma } from '@/lib/prisma';
import { error, success } from '@/lib/apiResponse';
import { parseLatLngToE5 } from '@/lib/spotUtils';

/**
 * スポット重複チェック API
 *
 * 仕様：
 * - 緯度経度をE5で比較、完全一致のスポットがあれば重複判定
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = parseLatLngToE5(
      searchParams.get('lat'),
      searchParams.get('lng'),
    );
    if (!parsed.ok) {
      return error('緯度経度が不正です。', 400);
    }
    const { latE5, lngE5 } = parsed;

    // E5一致で重複チェック
    const existing = await prisma.spot.findFirst({
      where: {
        latE5: latE5,
        lngE5: lngE5,
      },
    });

    return success({ exists: !!existing });
  } catch (err: unknown) {
    console.error('api/spots/exists GET failed', err);
    return error('サーバーエラーが発生しました', 500);
  }
}
