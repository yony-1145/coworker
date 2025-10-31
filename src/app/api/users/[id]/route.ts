import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

// 公開プロフィールの取得
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const profile = await prisma.userProfile.findUnique({
      where: { userId: id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('GET /api/users/[id] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// プロフィールの更新
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const cleanData = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v !== undefined)
    );

    const updated = await prisma.userProfile.upsert({
      where: { userId: id },
      update: cleanData,
      create: {
        userId: id,
        ...cleanData,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/users/[id] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
