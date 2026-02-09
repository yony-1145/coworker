import { getServerSession } from 'next-auth/next';
import type { AuthOptions } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import UserProfileEdit from '@/components/UserProfileEdit';

export default async function UserProfileEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions as AuthOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) redirect('/login');
  if (userId !== id) notFound();

  return <UserProfileEdit id={id} />;
}
