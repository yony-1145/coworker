import { z } from 'zod';

/** サインアップ用の入力スキーマ */
export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '名前を入力してください')
    .max(100, '名前は100文字以内で入力してください'),
  email: z
    .string()
    .trim()
    .min(1, 'メールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください')
    .email('正しいメールアドレスを入力してください')
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(256, 'パスワードは256文字以内で入力してください'),
});

export type SignupInput = z.infer<typeof signupSchema>;

/** API リクエストボディをサインアップ用に正規化する（name / email / password の trim 等） */
export function normalizeSignupBody(body: unknown): {
  name: string;
  email: string;
  password: string;
} {
  const name =
    typeof (body as { name?: unknown })?.name === 'string'
      ? (body as { name: string }).name.trim()
      : '';
  const email =
    typeof (body as { email?: unknown })?.email === 'string'
      ? (body as { email: string }).email.trim().toLowerCase()
      : '';
  const password =
    typeof (body as { password?: unknown })?.password === 'string'
      ? (body as { password: string }).password
      : '';
  return { name, email, password };
}
