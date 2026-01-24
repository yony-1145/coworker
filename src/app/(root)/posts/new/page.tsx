// src/app/posts/new/page.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PostNewClient from '@/components/PostNew';

export default async function NewPostPage() {
  // ログイン済みでなければサインインページへリダイレクト
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?next=/posts/new');
  }

  return <PostNewClient />;
}
