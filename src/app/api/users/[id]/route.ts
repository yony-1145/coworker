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

    const updatedProfile = await prisma.userProfile.update({
      where: { userId: params.id },
      data: {
        displayName: body.displayName,
        headline: body.headline,
        occupation: body.occupation,
        affiliation: body.affiliation,
        location: body.location,
        age: body.age,
        bioText: body.bioText,
        links: body.links,
        tags: body.tags,
        iconUrl: body.iconUrl,
      },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
