import { z } from 'zod';

/**
 * プロフィールのバリデーション・型定義
 * 仕様
 * - フロントエンドの型定義をzodで定義・検証
 * - APIリクエストはフロントエンドの型定義を拡張したものを使用
 */

// フロント・API共通の型定義・バリデーション
export const userProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'ユーザー名は1文字以上で入力してください')
    .max(20, 'ユーザー名は20文字以内で入力してください'),
  iconUrl: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => v == null || v === '' || z.string().url().safeParse(v).success,
      { message: '正しいURLを入力してください' },
    ),
  headline: z
    .string()
    .trim()
    .max(25, 'ひとことは25文字以内で入力してください')
    .optional()
    .nullable(),
  occupation: z
    .string()
    .trim()
    .max(15, '職業は15文字以内で入力してください')
    .optional()
    .nullable(),
  affiliation: z
    .string()
    .trim()
    .max(15, '所属は15文字以内で入力してください')
    .optional()
    .nullable(),
  bioText: z
    .string()
    .trim()
    .max(300, '自己紹介は300文字以内で入力してください')
    .optional()
    .nullable(),
  links: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'URLを入力してください')
        .url('正しいURLを入力してください'),
    )
    .max(3, 'SNSリンクは最大3件までです')
    .optional()
    .nullable(),
  tags: z
    .array(z.string().trim().min(1, '空のタグは登録できません'))
    .max(5, 'タグは最大5件までです')
    .optional()
    .nullable(),
});
// スキーマから型を生成
export type UserProfile = z.infer<typeof userProfileSchema>;

// userIdを追加したAPIリクエストの型定義・バリデーション
export const userProfileSchemaAPI = userProfileSchema.extend({
  userId: z.string(),
});

// スキーマから型を生成
export type UserProfileAPI = z.infer<typeof userProfileSchemaAPI>;
