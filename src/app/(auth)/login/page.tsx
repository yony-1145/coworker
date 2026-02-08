import { redirect } from 'next/navigation';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import LoginForm from '@/components/LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const session = await getServerSession(authOptions as AuthOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (userId) {
    redirect(searchParams?.next || `/users/${userId}`);
  }

  return <LoginForm />;
}
