import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import type { AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function UsersPage() {
  const session = await getServerSession(authOptions as AuthOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    redirect(`/login?next=/users`);
  }
  redirect(`/users/${userId}`);
}
