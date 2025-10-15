import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users?email=xxx@example.com
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('DB query failed:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
