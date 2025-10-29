import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 公開プロフィールの取得
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const profile = await prisma.userProfile.findUnique({
      where: { userId: id },
      select: {
        displayName: true,
        iconUrl: true,
        headline: true,
        occupation: true,
        affiliation: true,
        location: true,
        age: true,
        links: true,
        tags: true,
        bioText: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error('GET /api/users/[id] error:', err);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}

// プロフィールの更新
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (!session?.user?.id || session.user.id !== id) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const body = await req.json();

    const updated = await prisma.userProfile.upsert({
      where: { userId: id },
      update: {
        displayName: body.displayName,
        iconUrl: body.iconUrl,
        headline: body.headline,
        occupation: body.occupation,
        affiliation: body.affiliation,
        location: body.location,
        age: body.age,
        links: body.links,
        tags: body.tags,
        bioText: body.bioText,
      },
      create: {
        userId: id,
        displayName: body.displayName,
        iconUrl: body.iconUrl,
        headline: body.headline,
        occupation: body.occupation,
        affiliation: body.affiliation,
        location: body.location,
        age: body.age,
        links: body.links,
        tags: body.tags,
        bioText: body.bioText,
      },
    });

    return NextResponse.json({
      message: 'プロフィールを更新しました',
      profile: updated,
    });
  } catch (err) {
    console.error('PUT /api/users/[id] error:', err);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
