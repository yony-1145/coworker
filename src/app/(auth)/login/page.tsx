import { redirect } from 'next/navigation';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import LoginForm from '@/components/LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const session = await getServerSession(authOptions as AuthOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (userId) {
    const { next } = (await searchParams) ?? {};
    redirect(next || `/users/${userId}`);
  }

  return <LoginForm />;
}
