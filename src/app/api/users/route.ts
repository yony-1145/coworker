import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { error, success } from '@/lib/apiResponse';

/**
 * サインアップ用 API
 *
 * 仕様：
 * - 新規ユーザー（User）を作成
 * - 同時に UserProfile も初期状態で作成する
 */
export async function POST(req: Request) {
  try {
    // リクエストボディ取得
    const body = await req.json().catch(() => null);
    if (!body) {
      return error('入力内容が不正です', 400);
    }

    // 入力値の正規化・最低限のバリデーション
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email =
      typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    // 入力値のバリデーション
    if (!name || !email || !password) {
      return error('入力内容が不正です', 400);
    }

    // メールアドレス重複チェック
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return error('このメールアドレスは既に登録されています', 409);
    }

    // ハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // ユーザーとプロフィール作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            displayName: name,
            iconUrl: null,
            links: [],
            tags: [],
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return success({ user }, 201);
  } catch (err) {
    console.error('Failed to create user:', err);
    return error('サーバーエラーが発生しました', 500);
  }
}
