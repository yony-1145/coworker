import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id]
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // UserProfileを取得
    const profile = await prisma.userProfile.findUnique({
      where: { userId: params.id },
      select: {
        id: true,
        userId: true,
        displayName: true,
        iconUrl: true,
        headline: true,
        occupation: true,
        affiliation: true,
        bioText: true,
        links: true,
        tags: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: params.id },
      update: {
        displayName: body.displayName,
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
        displayName: body.displayName ?? '',
        iconUrl: body.iconUrl ?? null,
        headline: body.headline ?? null,
        occupation: body.occupation ?? null,
        affiliation: body.affiliation ?? null,
        bioText: body.bioText ?? null,
        links: body.links ?? [],
        tags: body.tags ?? [],
      },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
