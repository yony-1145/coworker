/** ユーザープロフィール用スキーマ（userProfileSchema / userProfileSchemaAPI / getProfileFormValidationErrors）の単体テスト */
import { describe, it, expect } from 'vitest';
import {
  userProfileSchema,
  userProfileSchemaAPI,
  getProfileFormValidationErrors,
} from '@/lib/validation/userProfileValidators';

describe('userProfileSchema', () => {
  const validMinimal = { name: '山田太郎' };
  const validFull = {
    name: '佐藤花子',
    iconUrl: 'https://example.com/icon.png',
    headline: 'リモートワーク好きです',
    occupation: 'エンジニア',
    affiliation: '株式会社サンプル',
    bioText: 'コワーキングスペースをよく利用しています。',
    links: ['https://x.com/foo', 'https://github.com/bar'],
    tags: ['リモート', 'フリーランス'],
  };

  // バリデーションを通過するケース
  describe('success cases', () => {
    // name だけの最小限の入力でも通過する
    it('accepts minimal valid input (name only)', () => {
      const result = userProfileSchema.safeParse(validMinimal);
      expect(result.success).toBe(true);
    });

    // ユーザー名が1〜20文字なら通過する
    it('accepts name with 1-20 characters', () => {
      expect(userProfileSchema.safeParse({ name: '田中' }).success).toBe(true);
      expect(
        userProfileSchema.safeParse({
          name: '山田山田山田山田山田山田山田山田山田山田', // 20文字
        }).success,
      ).toBe(true);
    });

    // 任意項目を null にしても通過する
    it('accepts optional null/omit', () => {
      expect(
        userProfileSchema.safeParse({
          name: '鈴木一郎',
          iconUrl: null,
          headline: null,
          links: null,
          tags: null,
        }).success,
      ).toBe(true);
    });

    // SNSリンクが有効なURLで最大3件なら通過する
    it('accepts valid URLs in links (max 3)', () => {
      const result = userProfileSchema.safeParse({
        name: '高橋',
        links: [
          'https://x.com/user1',
          'https://github.com/user1',
          'https://qiita.com/user1',
        ],
      });
      expect(result.success).toBe(true);
    });

    // タグが最大5件なら通過する
    it('accepts tags (max 5)', () => {
      const result = userProfileSchema.safeParse({
        name: '伊藤',
        tags: ['リモート', 'フリーランス', 'デザイン', 'エンジニア', 'マーケ'],
      });
      expect(result.success).toBe(true);
    });

    // 全項目を正しく埋めた入力で通過する
    it('accepts full valid input', () => {
      expect(userProfileSchema.safeParse(validFull).success).toBe(true);
    });
  });

  // バリデーションでエラーになるケース
  describe('failure cases', () => {
    // ユーザー名が空の場合、エラーになる
    it('rejects empty name', () => {
      const result = userProfileSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    // ユーザー名が21文字以上の場合、エラーになる
    it('rejects name longer than 20 characters', () => {
      const result = userProfileSchema.safeParse({
        name: '山田山田山田山田山田山田山田山田山田山田山', // 21文字
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    // ひとことが26文字以上の場合、エラーになる
    it('rejects headline longer than 25 characters', () => {
      const result = userProfileSchema.safeParse({
        name: '渡辺',
        headline: 'あいうえおかきくけこさしすせそたちつてとなにぬねのは', // 26文字
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.headline).toBeDefined();
      }
    });

    // SNSリンクが4件以上の場合、エラーになる
    it('rejects more than 3 links', () => {
      const result = userProfileSchema.safeParse({
        name: '中村',
        links: [
          'https://x.com/a',
          'https://github.com/b',
          'https://qiita.com/c',
          'https://zenn.dev/d',
        ],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.links).toBeDefined();
      }
    });

    // リンクに不正なURLが含まれる場合、エラーになる
    it('rejects invalid URL in links', () => {
      const result = userProfileSchema.safeParse({
        name: '小林',
        links: ['これはURLではない'],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.links).toBeDefined();
      }
    });

    // タグが6件以上の場合、エラーになる
    it('rejects more than 5 tags', () => {
      const result = userProfileSchema.safeParse({
        name: '加藤',
        tags: [
          'リモート',
          'フリーランス',
          'デザイン',
          'エンジニア',
          'マーケ',
          '6件目',
        ],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.tags).toBeDefined();
      }
    });

    // 空や空白だけのタグが含まれる場合、エラーになる
    it('rejects empty tag', () => {
      const result = userProfileSchema.safeParse({
        name: '吉田',
        tags: ['有効なタグ', '  ', ''],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.tags).toBeDefined();
      }
    });

    // アイコンURLが不正な形式の場合、エラーになる
    it('rejects invalid iconUrl', () => {
      const result = userProfileSchema.safeParse({
        name: '松本',
        iconUrl: 'これはURLではない',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.iconUrl).toBeDefined();
      }
    });
  });
});

// API 用スキーマ（userId 必須）
describe('userProfileSchemaAPI', () => {
  // name と userId があれば通過する
  it('accepts valid profile with userId', () => {
    const result = userProfileSchemaAPI.safeParse({
      name: '山田太郎',
      userId: 'clxx1234567890abcdef',
    });
    expect(result.success).toBe(true);
  });

  // userId がない場合、エラーになる
  it('rejects missing userId', () => {
    const result = userProfileSchemaAPI.safeParse({ name: '山田太郎' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.userId).toBeDefined();
    }
  });
});

describe('getProfileFormValidationErrors', () => {
  it('returns empty object when name and profile are valid', () => {
    const errors = getProfileFormValidationErrors(
      { links: [], tags: [] },
      '山田太郎',
    );
    expect(errors).toEqual({});
  });

  it('returns name error when userName is empty', () => {
    const errors = getProfileFormValidationErrors(
      { links: [], tags: [] },
      '',
    );
    expect(errors).toHaveProperty('name');
    expect(errors.name).toBe('ユーザー名は1文字以上で入力してください');
  });

  it('returns name error when userName is too long', () => {
    const errors = getProfileFormValidationErrors(
      { links: [], tags: [] },
      'あ'.repeat(21),
    );
    expect(errors).toHaveProperty('name');
    expect(errors.name).toBe('ユーザー名は20文字以内で入力してください');
  });

  it('returns headline error when headline is too long', () => {
    const errors = getProfileFormValidationErrors(
      { headline: 'あ'.repeat(26), links: [], tags: [] },
      '田中',
    );
    expect(errors).toHaveProperty('headline');
  });

  it('returns iconUrl error when iconUrl is invalid URL', () => {
    const errors = getProfileFormValidationErrors(
      { iconUrl: 'not-a-url', links: [], tags: [] },
      '佐藤',
    );
    expect(errors).toHaveProperty('iconUrl');
    expect(errors.iconUrl).toBe('正しいURLを入力してください');
  });

  it('returns links error when link is invalid URL', () => {
    const errors = getProfileFormValidationErrors(
      { links: ['invalid'], tags: [] },
      '鈴木',
    );
    expect(errors).toHaveProperty('links');
    expect(Array.isArray(errors.links)).toBe(true);
  });

  it('returns tags error when more than 5 tags', () => {
    const errors = getProfileFormValidationErrors(
      {
        tags: ['a', 'b', 'c', 'd', 'e', 'f'],
        links: [],
      },
      '高橋',
    );
    expect(errors).toHaveProperty('tags');
  });

  it('returns tags error when empty tag included', () => {
    const errors = getProfileFormValidationErrors(
      { tags: ['有効', '  ', ''], links: [] },
      '伊藤',
    );
    expect(errors).toHaveProperty('tags');
  });

  it('accepts valid full profile', () => {
    const errors = getProfileFormValidationErrors(
      {
        iconUrl: 'https://example.com/icon.png',
        headline: 'よろしく',
        occupation: 'エンジニア',
        affiliation: '株式会社X',
        bioText: '自己紹介',
        links: ['https://x.com/foo'],
        tags: ['リモート'],
      },
      '山田花子',
    );
    expect(errors).toEqual({});
  });
});
