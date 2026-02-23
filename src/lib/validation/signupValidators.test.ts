/** サインアップ用バリデーション（signupSchema / normalizeSignupBody）の単体テスト */
import { describe, it, expect } from 'vitest';
import {
  signupSchema,
  normalizeSignupBody,
} from '@/lib/validation/signupValidators';

describe('normalizeSignupBody', () => {
  it('trims name and email', () => {
    const body = { name: '  a  ', email: '  A@B.co  ', password: 'password12' };
    const out = normalizeSignupBody(body);
    expect(out.name).toBe('a');
    expect(out.email).toBe('a@b.co');
    expect(out.password).toBe('password12');
  });

  it('lowercases email', () => {
    const out = normalizeSignupBody({
      name: 'x',
      email: 'User@Example.COM',
      password: 'password12',
    });
    expect(out.email).toBe('user@example.com');
  });

  it('returns empty strings for missing or non-string fields', () => {
    expect(normalizeSignupBody(null)).toEqual({
      name: '',
      email: '',
      password: '',
    });
    expect(normalizeSignupBody(undefined)).toEqual({
      name: '',
      email: '',
      password: '',
    });
    expect(normalizeSignupBody({})).toEqual({
      name: '',
      email: '',
      password: '',
    });
    expect(
      normalizeSignupBody({ name: 1, email: 2, password: 3 }),
    ).toEqual({
      name: '',
      email: '',
      password: '',
    });
  });
});

describe('signupSchema', () => {
  const valid = {
    name: '山田太郎',
    email: 'user@example.com',
    password: 'password12',
  };

  describe('success cases', () => {
    it('accepts valid input', () => {
      const result = signupSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('accepts name 1-100 characters', () => {
      expect(signupSchema.safeParse({ ...valid, name: 'あ' }).success).toBe(
        true,
      );
      expect(
        signupSchema.safeParse({ ...valid, name: 'あ'.repeat(100) }).success,
      ).toBe(true);
    });

    it('transforms email to lowercase', () => {
      const result = signupSchema.safeParse({
        ...valid,
        email: 'User@Example.COM',
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.email).toBe('user@example.com');
    });

    it('accepts password 8-256 characters', () => {
      expect(
        signupSchema.safeParse({ ...valid, password: '12345678' }).success,
      ).toBe(true);
      expect(
        signupSchema.safeParse({
          ...valid,
          password: 'a'.repeat(256),
        }).success,
      ).toBe(true);
    });
  });

  describe('failure cases', () => {
    it('rejects empty name', () => {
      const result = signupSchema.safeParse({ ...valid, name: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    it('rejects name longer than 100 characters', () => {
      const result = signupSchema.safeParse({
        ...valid,
        name: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    it('rejects empty email', () => {
      const result = signupSchema.safeParse({ ...valid, email: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it('rejects invalid email format', () => {
      const result = signupSchema.safeParse({
        ...valid,
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it('rejects email longer than 255 characters', () => {
      const result = signupSchema.safeParse({
        ...valid,
        email: 'a'.repeat(251) + '@b.co', // 256 chars
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it('rejects password shorter than 8 characters', () => {
      const result = signupSchema.safeParse({
        ...valid,
        password: '1234567',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toBeDefined();
      }
    });

    it('rejects password longer than 256 characters', () => {
      const result = signupSchema.safeParse({
        ...valid,
        password: 'a'.repeat(257),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toBeDefined();
      }
    });
  });
});
