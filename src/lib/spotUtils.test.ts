/**
 * スポット用タグ正規化（normalizeTags）の単体テスト
 * 前後の空白削除・空文字除去・重複除去・最大10件の仕様を検証する
 */
import { describe, it, expect } from 'vitest';
import { normalizeTags } from '@/lib/spotUtils';

describe('normalizeTags', () => {
  // null を渡した場合、空配列を返すか（DB保存時の安全策）
  it('returns empty array for null', () => {
    expect(normalizeTags(null)).toEqual([]);
  });

  // undefined を渡した場合、空配列を返すか
  it('returns empty array for undefined', () => {
    expect(normalizeTags(undefined)).toEqual([]);
  });

  // 空配列を渡した場合、そのまま空配列を返すか
  it('returns empty array for empty array', () => {
    expect(normalizeTags([])).toEqual([]);
  });

  // 前後の空白を削除し、空文字と重複を取り除いた結果を返すか
  it('trims and removes empty strings and duplicates', () => {
    expect(
      normalizeTags([' 喫煙可 ', '', 'WiFi', '喫煙可', 'WiFi']),
    ).toEqual(['喫煙可', 'WiFi']);
  });

  // 11件以上渡した場合、先頭10件だけを返すか（仕様の上限）
  it('returns at most 10 tags', () => {
    const manyTags = [
      'WiFi',
      '電源',
      '静か',
      '喫煙可',
      '会議室',
      '個室',
      '駐車場',
      'ペット可',
      '24時間',
      '予約可',
      '追加タグ',
    ];
    expect(normalizeTags(manyTags)).toHaveLength(10);
    expect(normalizeTags(manyTags)).toEqual(manyTags.slice(0, 10));
  });

  // 重複したタグは、最初に出てきた順で返すか
  it('keeps order of first occurrence', () => {
    expect(
      normalizeTags(['静か', 'WiFi', '電源', 'WiFi', '静か']),
    ).toEqual(['静か', 'WiFi', '電源']);
  });
});
