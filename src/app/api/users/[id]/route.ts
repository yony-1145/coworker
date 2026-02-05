import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { error, success } from '@/lib/apiResponse';

/**
 * ユーザープロフィール取得 API
 *
 * 仕様：
 * - 未ログインアクセスを拒否
 * - User + UserProfile をまとめて返却
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // 未ログインアクセスを拒否
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return error('Unauthorized', 401);
    }

    // 指定された userId のユーザー情報を取得（本人・他人どちらのプロフィールも取得可能
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
      return error('User not found', 404);
    }

    // User + UserProfile をまとめて返却
    return success({ user });
  } catch (err) {
    console.error('Failed to fetch user', err);
    return error('Server error', 500);
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
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // 更新権限の確認
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return error('Unauthorized', 401);
    }

    if (session.user.id !== params.id) {
      return error('Forbidden', 403);
    }

    // フロントから送信された更新データ
    const body = await req.json();

    // User と UserProfile を同時に更新するため transaction を使用
    const result = await prisma.$transaction(async (tx) => {
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
          // age: body.age ?? null, // Todo:カラムが残っている間の暫定対応
          bioText: body.bioText ?? null,
          links: body.links ?? [],
          tags: body.tags ?? [],
        },
        create: {
          userId: params.id,
          // displayName Todo:カラムが残っている間の暫定対応
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

      // 更新後の User / UserProfile をまとめて返却（生データを返す）
      return { user: updatedUser, profile: updatedProfile };
    });

    return success(result);
  } catch {
    return error('Server error', 500);
  }
}
