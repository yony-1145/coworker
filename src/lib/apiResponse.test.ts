/** API 共通レスポンス（success / error）の単体テスト */
import { describe, it, expect } from 'vitest';
import { success, error } from '@/lib/apiResponse';

describe('success', () => {
  it('returns 200 and status success with data by default', async () => {
    const res = success({ id: '1' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: 'success', data: { id: '1' } });
  });

  it('accepts custom http status', async () => {
    const res = success({ created: true }, 201);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual({ status: 'success', data: { created: true } });
  });

  it('serializes null data', async () => {
    const res = success(null);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data).toBeNull();
  });
});

describe('error', () => {
  it('returns status error with message and code', async () => {
    const res = error('入力内容が不正です', 400);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({
      status: 'error',
      message: '入力内容が不正です',
      code: 400,
    });
  });

  it('uses httpStatus when provided', async () => {
    const res = error('入力内容が不正です', 422, 400);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe(422);
    expect(body.message).toBe('入力内容が不正です');
  });

  it('includes errors object when provided and non-empty', async () => {
    const res = error('バリデーションエラー', 422, undefined, {
      title: ['タイトルを入力してください'],
      latitude: ['数値で入力してください'],
    });
    const body = await res.json();
    expect(body.status).toBe('error');
    expect(body.message).toBe('バリデーションエラー');
    expect(body.code).toBe(422);
    expect(body.errors).toEqual({
      title: ['タイトルを入力してください'],
      latitude: ['数値で入力してください'],
    });
  });

  it('omits errors when empty object', async () => {
    const res = error('エラー', 500, undefined, {});
    const body = await res.json();
    expect(body).not.toHaveProperty('errors');
  });

  it('omits errors when undefined', async () => {
    const res = error('エラー', 500);
    const body = await res.json();
    expect(body).not.toHaveProperty('errors');
  });
});
