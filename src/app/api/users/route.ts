import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/users/[id]
 * ユーザープロフィール表示用 API
 *
 * - User（アカウント情報）と UserProfile（プロフィール情報）をまとめて取得
 * - プロフィール表示画面・編集画面の初期表示で使用
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // 指定された userId のユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { profile: true }, // プロフィールは常に紐付いている前提
    });

    // 対象ユーザーが存在しない場合
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // User + UserProfile をそのまま返却
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * PUT /api/users/[id]
 * ユーザープロフィール更新用 API
 *
 * - 表示名は User.name として更新（表示名の正）
 * - その他のプロフィール情報は UserProfile に保存
 * - User と UserProfile を同時に更新するため transaction を使用
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // フロントから送信された更新データを取得
    const body = await req.json();

    // User / UserProfile を一貫して更新するため transaction を使用
    const result = await prisma.$transaction(async (tx) => {
      // 表示名（アカウント名）は User.name を更新
      const updatedUser = await tx.user.update({
        where: { id: params.id },
        data: {
          name: body.name,
        },
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
    // サインアップフォームから送信されたデータを取得
    const body = await req.json();

    // ユーザー作成とプロフィール初期化を同時に行う
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password, // ※ 現状は平文。後でハッシュ化対応予定
        profile: {
          create: {
            // displayName カラムが残っている間の暫定対応
            displayName: body.name ?? '',
            iconUrl: null,
            links: [],
            tags: [],
          },
        },
      },
      // サインアップ後に必要な最小情報のみ返却
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
