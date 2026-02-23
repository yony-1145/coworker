/**
 * ジオコーディング API 用のリクエスト検証。
 * 入力不足時は 400 用のメッセージを返す。
 */
export function validateGeocodeBody(body: unknown): {
  ok: true;
  address: string;
} | {
  ok: false;
  message: string;
} {
  if (!body || typeof body !== 'object') {
    return { ok: false, message: '住所が未入力です。' };
  }
  const { address } = body as { address?: unknown };
  if (!address || typeof address !== 'string' || !address.trim()) {
    return { ok: false, message: '住所が未入力です。' };
  }
  return { ok: true, address: (address as string).trim() };
}
