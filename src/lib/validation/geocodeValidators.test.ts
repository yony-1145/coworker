/** ジオコーディング用リクエスト検証（validateGeocodeBody）の単体テスト */
import { describe, it, expect } from 'vitest';
import { validateGeocodeBody } from '@/lib/validation/geocodeValidators';

describe('validateGeocodeBody', () => {
  it('returns error when body is null', () => {
    const result = validateGeocodeBody(null);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toBe('住所が未入力です。');
  });

  it('returns error when body is undefined', () => {
    const result = validateGeocodeBody(undefined);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toBe('住所が未入力です。');
  });

  it('returns error when body is not an object', () => {
    expect(validateGeocodeBody('string').ok).toBe(false);
    expect(validateGeocodeBody(123).ok).toBe(false);
  });

  it('returns error when address is missing', () => {
    const result = validateGeocodeBody({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toBe('住所が未入力です。');
  });

  it('returns error when address is empty string', () => {
    const result = validateGeocodeBody({ address: '' });
    expect(result.ok).toBe(false);
  });

  it('returns error when address is whitespace only', () => {
    const result = validateGeocodeBody({ address: '   \t  ' });
    expect(result.ok).toBe(false);
  });

  it('returns error when address is not a string', () => {
    expect(validateGeocodeBody({ address: 123 }).ok).toBe(false);
    expect(validateGeocodeBody({ address: null }).ok).toBe(false);
  });

  it('returns ok and trimmed address when valid', () => {
    const result = validateGeocodeBody({ address: '  東京都渋谷区  ' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.address).toBe('東京都渋谷区');
  });

  it('accepts non-empty address', () => {
    const result = validateGeocodeBody({ address: '大阪府' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.address).toBe('大阪府');
  });
});
