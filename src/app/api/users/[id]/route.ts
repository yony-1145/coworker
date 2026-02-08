import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { error, success } from '@/lib/apiResponse';
import { userProfileSchema } from '@/lib/validation/userProfileValidators';

/**
 * ユーザープロフィール取得 API
 *
 * 仕様：
 * - 未ログインアクセスを拒否
 * - User + UserProfile をまとめて返却
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // 未ログインアクセスを拒否
    const session = await getServerSession(authOptions as AuthOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return error('ログインしてください', 401);
    }

    // 指定された userId のユーザー情報を取得（本人・他人どちらのプロフィールも取得可能
    const user = await prisma.user.findUnique({
      where: { id },
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
            // location: true,
            // age: true,
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
      return error('ユーザーが見つかりません', 404);
    }

    // User + UserProfile をまとめて返却
    return success({ user });
  } catch (err) {
    console.error('Failed to fetch user', err);
    return error('サーバーエラーが発生しました', 500);
  }
}

/**
 * ユーザープロフィール更新 API
 *
 * 仕様：
 * - フロントから送信されたUseName+UserProfileをデータを更新する
 *
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // 更新権限の確認
    const session = await getServerSession(authOptions as AuthOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return error('ログインしてください', 401);
    }

    if (userId !== id) {
      return error('この操作は許可されていません', 403);
    }

    const raw = await req.json();
    const parsed = userProfileSchema.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors;
      const first = Object.values(msg).flat().find(Boolean);
      return error(first ?? '入力内容に誤りがあります', 400);
    }
    const body = parsed.data;

    // User と UserProfile を同時に更新するため transaction を使用
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id },
        data: { name: body.name },
        select: { id: true, name: true },
      });

      // プロフィール詳細は UserProfile 側で管理
      const updatedProfile = await tx.userProfile.upsert({
        where: { userId: id },
        update: {
          iconUrl: body.iconUrl ?? null,
          headline: body.headline ?? null,
          occupation: body.occupation ?? null,
          affiliation: body.affiliation ?? null,
          // location: ,　TODO:　カラム削除予定
          // TODO: age カラム削除までの暫定対応
          bioText: body.bioText ?? null,
          links: body.links ?? [],
          tags: body.tags ?? [],
        },
        create: {
          userId: id,
          // TODO: displayName カラム削除までの暫定対応
          displayName: body.name ?? '',
          iconUrl: body.iconUrl ?? null,
          headline: body.headline ?? null,
          occupation: body.occupation ?? null,
          affiliation: body.affiliation ?? null,
          // location: null,
          // age: null, // TODO: カラム削除予定
          bioText: body.bioText ?? null,
          links: body.links ?? [],
          tags: body.tags ?? [],
        },
      });

      // 更新後の User / UserProfile をまとめて返却（生データを返す）
      return { user: updatedUser, profile: updatedProfile };
    });

    return success(result);
  } catch {
    return error('サーバーエラーが発生しました', 500);
  }
}
