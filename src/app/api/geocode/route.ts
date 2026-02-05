import { error, success } from '@/lib/apiResponse';

/**
 * ジオコーディング API
 *
 * 仕様：
 * - 住所・地名を緯度経度に変換（OpenCage API 利用）
 * - 画面表示用に検索結果を最大5件返却
 * - 結果が0件の場合でもから配列を返す
 */
export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    // 住所未入力
    if (!address || typeof address !== 'string' || !address.trim()) {
      return error('住所が未入力です。', 400);
    }

    const apiKey = process.env.OPENCAGE_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENCAGE_API_KEY in env');
      return error('サーバー設定の問題が発生しました。', 500);
    }

    // OpenCage API にリクエスト
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address.trim(),
    )}&key=${apiKey}&limit=5&language=ja`;

    let ocRes: Response;
    try {
      ocRes = await fetch(url);
    } catch (err) {
      console.error('OpenCage fetch failed:', err);
      return error('外部API接続に失敗しました。', 502);
    }

    const rawText = await ocRes.text();

    // レスポンスの型定義
    let data: {
      results?: Array<{
        formatted: string;
        geometry: { lat: number; lng: number };
      }>;
    };
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error('OpenCage JSON parse error:', err);
      return error('検索結果を取得できませんでした。', 502);
    }

    // 0件の場合は空配列で成功
    if (!data.results || data.results.length === 0) {
      return success({ results: [] });
    }

    // 緯度経度・表示名に変換
    const results = data.results.map((r) => ({
      name: r.formatted,
      latitude: r.geometry.lat,
      longitude: r.geometry.lng,
    }));

    return success({ results });
  } catch (err) {
    console.error('Unexpected server error:', err);
    return error('検索処理に失敗しました。', 500);
  }
}
