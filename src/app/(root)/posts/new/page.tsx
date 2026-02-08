// src/app/posts/new/page.tsx
import { getServerSession } from 'next-auth/next';
import type { AuthOptions } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import PostNewClient from '@/components/PostNew';

export default async function NewPostPage() {
  // ログイン済みでなければサインインページへリダイレクト
  const session = await getServerSession(authOptions as AuthOptions);

  if (!session) {
    redirect('/login?next=/posts/new');
  }

  return <PostNewClient />;
}
