// src/app/(auth)/signup/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SignupForm from '@/components/SignupForm';

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect(`/users/${session.user.id}`);
  }

  return <SignupForm />;
}
