/** スポット用ユーティリティ（getDefaultSpotIconByGenre / normalizeTags / parseLatLngToE5）の単体テスト */
import { describe, it, expect } from 'vitest';
import {
  getDefaultSpotIconByGenre,
  normalizeTags,
  parseLatLngToE5,
} from '@/lib/spotUtils';

describe('getDefaultSpotIconByGenre', () => {
  it('returns cafe.svg for CAFE', () => {
    expect(getDefaultSpotIconByGenre('CAFE')).toBe('/spot-icons/cafe.svg');
  });

  it('returns cowoking.svg for COWORKING', () => {
    expect(getDefaultSpotIconByGenre('COWORKING')).toBe(
      '/spot-icons/cowoking.svg',
    );
  });

  it('returns pin.svg for OTHER', () => {
    expect(getDefaultSpotIconByGenre('OTHER')).toBe('/spot-icons/pin.svg');
  });

  it('returns pin.svg for null', () => {
    expect(getDefaultSpotIconByGenre(null)).toBe('/spot-icons/pin.svg');
  });

  it('returns pin.svg for undefined', () => {
    expect(getDefaultSpotIconByGenre(undefined)).toBe('/spot-icons/pin.svg');
  });
});

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

describe('parseLatLngToE5', () => {
  it('returns ok and E5 values for valid numbers', () => {
    const result = parseLatLngToE5('35.6812', '139.7671');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.latE5).toBe(3568120);
      expect(result.lngE5).toBe(13976710);
    }
  });

  it('rounds to nearest E5 integer', () => {
    const result = parseLatLngToE5('35.68124', '139.76716');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.latE5).toBe(3568124);
      expect(result.lngE5).toBe(13976716);
    }
  });

  it('returns ok: false for NaN lat', () => {
    expect(parseLatLngToE5('invalid', '139.76').ok).toBe(false);
  });

  it('returns ok: false for NaN lng', () => {
    expect(parseLatLngToE5('35.68', 'invalid').ok).toBe(false);
  });

  it('returns ok: false for null/empty', () => {
    expect(parseLatLngToE5(null, '139.76').ok).toBe(false);
    expect(parseLatLngToE5('35.68', null).ok).toBe(false);
    expect(parseLatLngToE5('', '').ok).toBe(false);
  });

  it('handles negative coordinates', () => {
    const result = parseLatLngToE5('-35.6812', '-139.7671');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.latE5).toBe(-3568120);
      expect(result.lngE5).toBe(-13976710);
    }
  });
});
