import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * POST /api/users
 * サインアップ用 API
 *
 * - 新規ユーザー（User）を作成
 * - 同時に UserProfile も初期状態で作成する
 * - 表示名は User.name を正とする
 */
export async function POST(req: Request) {
  try {
    // リクエストボディ取得
    const body = await req.json();

    // 入力値の正規化・最低限のバリデーション
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email =
      typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // メールアドレス重複チェック
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 },
      );
    }

    // パスワードは必ずハッシュ化して保存
    const hashedPassword = await bcrypt.hash(password, 12);

    // ユーザー & プロフィール作成
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
      // レスポンスに password を含めない
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
