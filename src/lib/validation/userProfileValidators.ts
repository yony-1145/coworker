import { z } from 'zod';

/**
 * プロフィールのバリデーション・型定義。
 * フロント・API 共通の Zod スキーマ。API 用は extend で userId を追加。
 */
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

export type UserProfile = z.infer<typeof userProfileSchema>;

/** userId を追加した API リクエスト用スキーマ */
export const userProfileSchemaAPI = userProfileSchema.extend({
  userId: z.string(),
});

export type UserProfileAPI = z.infer<typeof userProfileSchemaAPI>;

/** プロフィールフォーム用の payload 型 */
export type UserProfileFormPayload = {
  iconUrl?: string | null;
  headline?: string | null;
  occupation?: string | null;
  affiliation?: string | null;
  bioText?: string | null;
  links?: string[];
  tags?: string[];
};

/**
 * プロフィールフォーム用のバリデーション。
 * userProfileSchema で検証し、フォーム表示用のエラーオブジェクトを返す。
 * links は配列のまま、それ以外は先頭メッセージのみ。
 */
export function getProfileFormValidationErrors(
  profile: UserProfileFormPayload,
  userName: string,
): Record<string, string | string[]> {
  const payload = {
    name: userName ?? '',
    iconUrl: profile?.iconUrl ?? null,
    headline: profile?.headline ?? null,
    occupation: profile?.occupation ?? null,
    affiliation: profile?.affiliation ?? null,
    bioText: profile?.bioText ?? null,
    links: profile?.links ?? [],
    tags: profile?.tags ?? [],
  };
  const result = userProfileSchema.safeParse(payload);
  if (result.success) return {};
  const fieldErrors = result.error.flatten().fieldErrors;
  const newErrors: Record<string, string | string[]> = {};
  for (const [k, v] of Object.entries(fieldErrors)) {
    if (!v?.length) continue;
    newErrors[k] = k === 'links' ? v : v[0];
  }
  return newErrors;
}
