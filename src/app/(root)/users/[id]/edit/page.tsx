'use client';

import { useEffect, useState, use } from 'react';
import { ProfileForm } from '@/components/ProfileForm';

/**
 * /users/[id]/edit
 * - プロフィールデータ取得とレイアウト担当
 * - Form側で編集・保存を完結
 */
export default function UserProfileEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = use(params);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/users/${id}`, { cache: 'no-store' });
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  if (loading)
    return <p className="text-center mt-20 text-gray-500">読み込み中...</p>;
  if (!profile)
    return (
      <p className="text-center mt-20 text-gray-500">
        ユーザーが見つかりません。
      </p>
    );

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

        <ProfileForm initialProfile={profile} id={id} />
      </div>
    </main>
  );
}
