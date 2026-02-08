import { unstable_cache } from 'next/cache';
import { error, success } from '@/lib/apiResponse';

const NOMINATIM_FETCH_TIMEOUT_MS = 8000;
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

/**
 * ジオコーディング API
 *
 * 仕様：
 * - 住所・地名を緯度経度に変換（Nominatim）
 * - 同一クエリは5分間キャッシュ
 * - 画面表示用に検索結果を最大5件返却
 */
export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address || typeof address !== 'string' || !address.trim()) {
      return error('住所が未入力です。', 400);
    }

    const trimmed = address.trim();

    const userAgent = (process.env.GEOCODE_USER_AGENT ?? '').trim();
    if (!userAgent) {
      return error(
        'サーバー設定の問題が発生しました。（GEOCODE_USER_AGENT を設定してください）',
        500,
      );
    }

    const results = await unstable_cache(
      async () => {
        const params = new URLSearchParams({
          q: trimmed,
          format: 'json',
          limit: '5',
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          NOMINATIM_FETCH_TIMEOUT_MS,
        );

        let res: Response;
        try {
          res = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
            signal: controller.signal,
            headers: {
              'User-Agent': userAgent,
              'Accept-Language': 'ja',
            },
          });
        } finally {
          clearTimeout(timeoutId);
        }

        if (!res.ok) {
          throw new Error(`Nominatim HTTP ${res.status}`);
        }

        const data = (await res.json()) as Array<{
          lat: string;
          lon: string;
          display_name: string;
        }>;

        if (!Array.isArray(data) || data.length === 0) {
          return [];
        }

        return data.map((r) => ({
          name: r.display_name,
          latitude: parseFloat(r.lat),
          longitude: parseFloat(r.lon),
        }));
      },
      ['geocode', trimmed],
      { revalidate: 300 },
    )();

    return success({ results });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return error(
        '検索がタイムアウトしました。しばらくしてからお試しください。',
        504,
      );
    }
    console.error('Unexpected server error:', err);
    return error('検索処理に失敗しました。', 500);
  }
}
