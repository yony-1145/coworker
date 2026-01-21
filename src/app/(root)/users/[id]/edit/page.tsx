'use client';

import { useEffect, useState, use } from 'react';
import { ProfileForm } from '@/components/ProfileForm';

type UserProfile = {
  id: string;
  userId: string;
  iconUrl?: string | null;
  headline?: string | null;
  occupation?: string | null;
  affiliation?: string | null;
  location?: string | null;
  age?: number | null;
  links?: unknown;
  tags?: unknown;
  bioText?: string | null;
  updatedAt: string;
};

type UserResponse = {
  id: string;
  name: string;
  profile: UserProfile | null;
};

export default function UserProfileEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/users/${id}`, { cache: 'no-store' });
      const data = await res.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">読み込み中...</p>;
  }

  if (!user || !user.profile) {
    return (
      <p className="text-center mt-20 text-gray-500">
        ユーザーが見つかりません。
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-10 border border-gray-100 space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            プロフィールを編集
          </h1>
          <button
            type="submit"
            form="profileForm"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            保存
          </button>
        </div>

        <ProfileForm
          initialProfile={user.profile}
          initialUserName={user.name}
          id={id}
        />
      </div>
    </main>
  );
}
