// src/app/api/spots/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * スポット投稿（POST）用の入力スキーマ
 * - API側で型・必須項目・制約を保証する
 */
const SpotPostSchema = z.object({
  userId: z.string().min(1), // 要修正
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(2000).optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().trim().max(255).optional().nullable(),
  imageUrls: z.array(z.string().url()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

/**
 * タグ配列をDB保存用に正規化する
 * - trim
 * - 空文字除去
 * - 重複除去
 * - 最大10件
 */
function normalizeTags(tags?: string[] | null) {
  if (!Array.isArray(tags)) return [];
  const uniq = new Set(tags.map((t) => t.trim()).filter((t) => t.length > 0));
  return Array.from(uniq).slice(0, 10);
}

/**
 * 成功時のレスポンスを返す
 */
function ok(data: unknown, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

/**
 * エラー時のレスポンスを返す
 */
function err(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: { code, message, details } },
    { status }
  );
}

/**
 * GET /api/spots
 * - スポット一覧取得
 * - 検索クエリ（q）対応
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    const spots = await prisma.spot.findMany({
      where: q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        user: { select: { id: true, name: true, image: true } },
        tags: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return ok({ spots });
  } catch {
    return err('INTERNAL_ERROR', 'Internal Server Error', 500);
  }
}

/**
 * POST /api/spots
 * - 新規スポットを作成する
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // リクエストボディ検証
    const parsed = SpotPostSchema.safeParse(body);
    if (!parsed.success) {
      return err(
        'VALIDATION_ERROR',
        'Invalid request body',
        400,
        parsed.error.flatten()
      );
    }

    const v = parsed.data;
    const tags = normalizeTags(v.tags);

    // ユーザーがDBに存在するか確認
    const user = await prisma.user.findUnique({ where: { id: v.userId } });
    if (!user) return err('USER_NOT_FOUND', 'User not found', 400);

    // スポットを作成
    const newSpot = await prisma.spot.create({
      data: {
        userId: v.userId,
        title: v.title.trim(),
        description: v.description?.trim() ?? null,
        latitude: v.latitude,
        longitude: v.longitude,
        address: v.address?.trim() ?? null,
        imageUrls: v.imageUrls ?? [],
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

    return ok({ spot: newSpot }, 201);
  } catch {
    return err('INTERNAL_ERROR', 'Internal Server Error', 500);
  }
}
