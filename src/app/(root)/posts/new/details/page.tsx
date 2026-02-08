// src/app/posts/new/details/page.tsx
import { getServerSession } from 'next-auth/next';
import type { AuthOptions } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PostSpotDetail from '@/components/PostSpotDetail';

export default async function PostNewDetailsPage() {
  // ログイン済みでなければサインインページへリダイレクト
  const session = await getServerSession(authOptions as AuthOptions);

  if (!session) {
    redirect('/login?next=/posts/new');
  }

  return <PostSpotDetail />;
}
