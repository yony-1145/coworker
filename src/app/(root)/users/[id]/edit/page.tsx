import { getServerSession } from 'next-auth/next';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserProfileEdit from '@/components/UserProfileEdit';

export default async function UserProfileEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) redirect('/signin');
  if (session.user.id !== id) notFound();

  return <UserProfileEdit id={id} />;
}
