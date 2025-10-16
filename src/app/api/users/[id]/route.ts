import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// /api/users/[id] → ユーザー情報＋最新の位置を返す
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Promiseをawait

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error('GET /api/users/[id] error:', err);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
