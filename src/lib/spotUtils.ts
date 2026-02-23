/** スポット用ユーティリティ（アイコン・タグ・緯度経度）。 */

/** ジャンルに応じたスポット用デフォルトアイコン URL を返す。 */
export function getDefaultSpotIconByGenre(
  genre?: 'CAFE' | 'COWORKING' | 'OTHER' | null,
): string {
  switch (genre) {
    case 'CAFE':
      return '/spot-icons/cafe.svg';
    case 'COWORKING':
      return '/spot-icons/cowoking.svg';
    case 'OTHER':
    default:
      return '/spot-icons/pin.svg';
  }
}

/** タグ配列を DB 保存用に正規化する（trim・空除去・重複除去・最大10件）。 */
export function normalizeTags(tags?: string[] | null): string[] {
  if (!Array.isArray(tags)) return [];
  const uniq = new Set(tags.map((t) => t.trim()).filter((t) => t.length > 0));
  return Array.from(uniq).slice(0, 10);
}

/** 緯度・経度クエリをパースして E5 形式（整数）に変換する。重複チェック等で使用。 */
export function parseLatLngToE5(
  latStr: string | null,
  lngStr: string | null,
): { ok: true; latE5: number; lngE5: number } | { ok: false } {
  const lat = parseFloat(latStr ?? '');
  const lng = parseFloat(lngStr ?? '');
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { ok: false };
  }
  return {
    ok: true,
    latE5: Math.round(lat * 1e5),
    lngE5: Math.round(lng * 1e5),
  };
}
