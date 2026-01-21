import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();

    // User.name と UserProfile を同時更新するため、トランザクションを使用
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: params.id },
        data: { name: body.name },
        select: { id: true, name: true },
      });

      const updatedProfile = await tx.userProfile.upsert({
        where: { userId: params.id },
        update: {
          displayName: body.name,
          iconUrl: body.iconUrl,
          headline: body.headline,
          occupation: body.occupation,
          affiliation: body.affiliation,
          bioText: body.bioText,
          links: body.links,
          tags: body.tags,
        },
        create: {
          userId: params.id,
          displayName: body.name ?? '',
          iconUrl: body.iconUrl ?? null,
          headline: body.headline ?? null,
          occupation: body.occupation ?? null,
          affiliation: body.affiliation ?? null,
          bioText: body.bioText ?? null,
          links: body.links ?? [],
          tags: body.tags ?? [],
        },
      });

      return { user: updatedUser, profile: updatedProfile };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Failed to update user/profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
