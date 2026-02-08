// src/app/(auth)/signup/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession, type AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import SignupForm from '@/components/SignupForm';

export default async function SignupPage() {
  const session = await getServerSession(authOptions as AuthOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (userId) {
    redirect(`/users/${userId}`);
  }

  return <SignupForm />;
}
