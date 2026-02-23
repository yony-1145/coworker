'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/map';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('メールアドレスまたはパスワードが正しくありません');
      return;
    }

    router.replace(next);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-900 p-6 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">ログイン</h1>

        {searchParams.get('next') && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400 text-center">
            続行するにはログインが必要です
          </p>
        )}

        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
          className="mb-3 w-full border border-gray-200 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          required
          className="mb-4 w-full border border-gray-200 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          ログイン
        </button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            ユーザー登録はこちらから
          </Link>
        </p>
      </form>
    </div>
  );
}
