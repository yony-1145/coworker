import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import type { AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { error, success } from '@/lib/apiResponse';
import { getDefaultSpotIconByGenre } from '@/lib/spotIcons';
import { normalizeTags } from '@/lib/spotUtils';

/**
 * スポット投稿（POST）用の入力スキーマ
 * - API側でも型・必須項目・制約を保証するためにZodを使用
 */
const SpotPostSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(2000).optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().trim().max(255).optional().nullable(),
  openingHours: z.string().trim().max(100).optional().nullable(),
  genre: z.enum(['CAFE', 'COWORKING', 'OTHER']).optional(),
  hasWifi: z.boolean().optional(),
  hasPower: z.boolean().optional(),
  hasQuietSpace: z.boolean().optional(),
  hasLargeTable: z.boolean().optional(),
  hasPhoneCallOK: z.boolean().optional(),
  hasMeetingSpace: z.boolean().optional(),
  crowdLevel: z.enum(['LOW', 'MID', 'HIGH']).optional(),
  imageUrls: z.array(z.string().url()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
}); // Todo:修正予定、別ファイルに移動

/**
 * スポット一覧取得 API
 *
 * 仕様：
 * - スポット一覧を取得
 * - 検索クエリ（q）対応
 */
export async function GET(req: Request) {
  try {
    if (!process.env.DATABASE_URL?.trim()) {
      return success({ spots: [] });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    const spots = await prisma.spot.findMany({
      where: q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : undefined,
      include: {
        user: { select: { id: true, name: true, image: true } },
        tags: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return success({ spots });
  } catch (err: unknown) {
    console.error('api/spots GET failed', err);
    if (
      err instanceof Prisma.PrismaClientInitializationError ||
      (err instanceof Prisma.PrismaClientKnownRequestError &&
        ['P1000', 'P1001', 'P1017'].includes(err.code))
    ) {
      return error(
        'データベースに接続できません。DATABASE_URL と DB の起動状態を確認してください。',
        503,
      );
    }
    return error('サーバーエラーが発生しました', 500);
  }
}

/**
 * 新規スポット作成 API
 *
 * 仕様：
 * - ログイン必須
 * - 新規スポットを作成する
 */
export async function POST(req: Request) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions as AuthOptions);
    const sessionUserId = (session?.user as { id?: string } | undefined)?.id;
    if (!sessionUserId) {
      return error('ログインしてください', 401);
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return error('入力内容が不正です', 400);
    }

    // リクエストボディ検証
    const parsed = SpotPostSchema.safeParse(body);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      return error(
        '入力内容が不正です',
        422,
        undefined,
        flattened.fieldErrors as Record<string, string[]>,
      );
    }

    const v = parsed.data;
    const tags = normalizeTags(v.tags);
    const userId = sessionUserId;

    // 緯度経度をE5形式に変換、浮動小数による誤差を防ぐために四捨五入
    const latE5 = Math.round(v.latitude * 1e5);
    const lngE5 = Math.round(v.longitude * 1e5);

    // スポットを作成
    const newSpot = await prisma.spot.create({
      data: {
        userId: userId,
        title: v.title.trim(),
        description: v.description?.trim() ?? null,
        latitude: v.latitude,
        longitude: v.longitude,
        latE5: latE5,
        lngE5: lngE5,
        address: v.address?.trim() ?? null,
        openingHours: v.openingHours?.trim() ?? null,
        genre: v.genre ?? 'CAFE',
        hasWifi: v.hasWifi ?? false,
        hasPower: v.hasPower ?? false,
        hasQuietSpace: v.hasQuietSpace ?? false,
        hasLargeTable: v.hasLargeTable ?? false,
        hasPhoneCallOK: v.hasPhoneCallOK ?? false,
        hasMeetingSpace: v.hasMeetingSpace ?? false,
        crowdLevel: v.crowdLevel ?? 'MID',
        imageUrls:
          v.imageUrls && v.imageUrls.length > 0
            ? v.imageUrls
            : [getDefaultSpotIconByGenre(v.genre)],
        ...(tags.length > 0
          ? {
              tags: {
                connectOrCreate: tags.map((t) => ({
                  where: { name: t },
                  create: { name: t },
                })),
              },
            }
          : {}),
      },
      include: { tags: { select: { name: true } } },
    });

    // 画像をSpotImageテーブルに保存（複数対応・未選択時はジャンル別デフォルト1件）
    const imageUrlsToSave =
      v.imageUrls && v.imageUrls.length > 0
        ? v.imageUrls
        : [getDefaultSpotIconByGenre(v.genre)];
    await prisma.spotImage.createMany({
      data: imageUrlsToSave.map((url, index) => ({
        spotId: newSpot.id,
        url: url,
        sortOrder: index,
      })),
    });

    // 作成したSpotを再取得（imagesを含む）
    const spotWithImages = await prisma.spot.findUnique({
      where: { id: newSpot.id },
      include: {
        tags: { select: { name: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    return success({ spot: spotWithImages }, 201);
  } catch (err: unknown) {
    console.error('api/spots POST failed', err);
    // Prismaのunique制約エラー(P2002)で重複するスポットを特定
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return error('既に登録されているスポットです。', 409);
    }
    return error('サーバーエラーが発生しました', 500);
  }
}
