import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?next=/users`);
  }
  redirect(`/users/${session.user.id}`);
}
