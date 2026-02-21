/**
 * タグ配列をDB保存用に正規化する
 * - trim
 * - 空文字除去
 * - 重複除去
 * - 最大10件
 */
export function normalizeTags(tags?: string[] | null): string[] {
  if (!Array.isArray(tags)) return [];
  const uniq = new Set(tags.map((t) => t.trim()).filter((t) => t.length > 0));
  return Array.from(uniq).slice(0, 10);
}
