import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const body = await req.json();

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        profile: {
          create: {
            displayName: body.name ?? '',
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

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
