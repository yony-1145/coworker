/** アップロード用入力検証（getExtension / validateUploadInput）の単体テスト */
import { describe, it, expect } from 'vitest';
import {
  getExtension,
  validateUploadInput,
  UPLOAD_MAX_BYTES,
} from '@/lib/validation/uploadValidators';

describe('getExtension', () => {
  it('returns extension in lowercase', () => {
    expect(getExtension('photo.JPG')).toBe('jpg');
    expect(getExtension('icon.PNG')).toBe('png');
  });

  it('returns last part when multiple dots', () => {
    expect(getExtension('my.file.name.png')).toBe('png');
  });

  it('returns png when no extension', () => {
    expect(getExtension('noext')).toBe('png');
  });

  it('returns png when empty string', () => {
    expect(getExtension('')).toBe('png');
  });

  it('returns single-char extension', () => {
    expect(getExtension('x.y')).toBe('y');
  });
});

describe('validateUploadInput', () => {
  const validImage = new File(['content'], 'test.png', { type: 'image/png' });

  it('returns error when file is null', () => {
    const result = validateUploadInput(null, 'spot');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toBe('ファイルを選択してください');
  });

  it('returns error when type is not spot or user', () => {
    const result = validateUploadInput(validImage, 'invalid');
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.message).toBe(
        'type は "spot" または "user" を指定してください',
      );
  });

  it('accepts type "spot"', () => {
    const result = validateUploadInput(validImage, 'spot');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.type).toBe('spot');
  });

  it('accepts type "user"', () => {
    const result = validateUploadInput(validImage, 'user');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.type).toBe('user');
  });

  it('defaults type to spot when typeRaw is null', () => {
    const result = validateUploadInput(validImage, null);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.type).toBe('spot');
  });

  it('returns error when file is not image', () => {
    const textFile = new File(['text'], 'doc.txt', { type: 'text/plain' });
    const result = validateUploadInput(textFile, 'spot');
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.message).toBe('画像ファイルのみアップロードできます');
  });

  it('returns error when file exceeds 5MB', () => {
    const bigContent = new Uint8Array(UPLOAD_MAX_BYTES + 1);
    const bigFile = new File([bigContent], 'big.png', { type: 'image/png' });
    const result = validateUploadInput(bigFile, 'spot');
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.message).toBe('ファイルサイズは5MB以内にしてください');
  });

  it('accepts file exactly 5MB', () => {
    const exactContent = new Uint8Array(UPLOAD_MAX_BYTES);
    const exactFile = new File([exactContent], 'exact.png', {
      type: 'image/png',
    });
    const result = validateUploadInput(exactFile, 'spot');
    expect(result.ok).toBe(true);
  });

  it('returns ext from file name when valid', () => {
    const file = new File([], 'photo.jpeg', { type: 'image/jpeg' });
    const result = validateUploadInput(file, 'spot');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.ext).toBe('jpeg');
  });
});
