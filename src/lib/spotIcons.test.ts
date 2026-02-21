/**
 * スポット用デフォルトアイコン（getDefaultSpotIconByGenre）の単体テスト
 * ジャンルごとに正しいアイコンURLが返ることを検証する
 */
import { describe, it, expect } from 'vitest';
import { getDefaultSpotIconByGenre } from '@/lib/spotIcons';

describe('getDefaultSpotIconByGenre', () => {
  // ジャンルが CAFE の場合、カフェ用アイコンを返すか
  it('returns cafe.svg for CAFE', () => {
    expect(getDefaultSpotIconByGenre('CAFE')).toBe('/spot-icons/cafe.svg');
  });

  // ジャンルが COWORKING の場合、コワーキング用アイコンを返すか
  it('returns cowoking.svg for COWORKING', () => {
    expect(getDefaultSpotIconByGenre('COWORKING')).toBe(
      '/spot-icons/cowoking.svg',
    );
  });

  // ジャンルが OTHER の場合、汎用ピンアイコンを返すか
  it('returns pin.svg for OTHER', () => {
    expect(getDefaultSpotIconByGenre('OTHER')).toBe('/spot-icons/pin.svg');
  });

  // ジャンルが null の場合、汎用ピンアイコンを返すか（デフォルト）
  it('returns pin.svg for null', () => {
    expect(getDefaultSpotIconByGenre(null)).toBe('/spot-icons/pin.svg');
  });

  // ジャンルが undefined の場合、汎用ピンアイコンを返すか（デフォルト）
  it('returns pin.svg for undefined', () => {
    expect(getDefaultSpotIconByGenre(undefined)).toBe('/spot-icons/pin.svg');
  });
});
