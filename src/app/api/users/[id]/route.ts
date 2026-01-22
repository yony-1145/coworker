import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

/**
 * GET /api/users/[id]
 * ユーザープロフィール取得 API
 *
 * 用途：
 * - ユーザープロフィール表示画面
 * - プロフィール編集画面の初期表示
 *
 * 仕様：
 * - User（アカウント情報）と UserProfile（プロフィール情報）をまとめて取得
 * - 表示名の正は User.name
 * - パスワードやメールアドレスなどの機密情報は返却しない
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // 指定された userId のユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        image: true,
        profile: {
          select: {
            id: true,
            userId: true,
            iconUrl: true,
            headline: true,
            occupation: true,
            affiliation: true,
            location: true,
            age: true,
            links: true,
            tags: true,
            bioText: true,
            updatedAt: true,
          },
        },
      },
    });

    // 対象ユーザーが存在しない場合
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // User + UserProfile をまとめて返却
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * PUT /api/users/[id]
 * ユーザープロフィール更新 API
 *
 * 用途：
 * - プロフィール編集画面からの保存処理
 *
 * 仕様：
 * - 表示名は User.name として更新（表示名の正）
 * - その他のプロフィール情報は UserProfile に保存
 * - User / UserProfile を一貫して更新するため transaction を使用
 *
 * 注意：
 * - UserProfile.displayName は create 時のみ使用（暫定）
 *   将来的にカラム削除予定
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // 更新権限の確認
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // フロントから送信された更新データを取得
    const body = await req.json();

    // User と UserProfile を同時に更新するため transaction を使用
    const result = await prisma.$transaction(async (tx) => {
      // 表示名（アカウント名）は User.name を更新
      const updatedUser = await tx.user.update({
        where: { id: params.id },
        data: { name: body.name },
        select: { id: true, name: true },
      });

      // プロフィール詳細は UserProfile 側で管理
      const updatedProfile = await tx.userProfile.upsert({
        where: { userId: params.id },
        update: {
          iconUrl: body.iconUrl ?? null,
          headline: body.headline ?? null,
          occupation: body.occupation ?? null,
          affiliation: body.affiliation ?? null,
          location: body.location ?? null,
          age: body.age ?? null,
          bioText: body.bioText ?? null,
          links: body.links ?? [],
          tags: body.tags ?? [],
        },
        create: {
          userId: params.id,
          // displayName カラムが残っている間の暫定対応
          displayName: body.name ?? '',
          iconUrl: body.iconUrl ?? null,
          headline: body.headline ?? null,
          occupation: body.occupation ?? null,
          affiliation: body.affiliation ?? null,
          location: body.location ?? null,
          age: body.age ?? null,
          bioText: body.bioText ?? null,
          links: body.links ?? [],
          tags: body.tags ?? [],
        },
      });

      // 更新後の User / UserProfile をまとめて返却
      return { user: updatedUser, profile: updatedProfile };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Failed to update user/profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
