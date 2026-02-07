'use client';

import { useEffect, useState } from 'react';
import { ProfileForm } from '@/components/ProfileForm';

// TODO: UserProfile の型定義を共通化・修正予定
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

/**
 * ユーザープロフィール編集ページ
 * - 指定IDのユーザープロフィールを取得し、編集フォームを表示
 * - 取得失敗・不正なレスポンス時はエラー表示
 */
export default function UserProfileEditClient({ id }: { id: string }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * 指定IDのユーザーを取得し state にセット
     * - ApiResponse（status / data）で判定し、失敗時は user を null に
     */
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`, { cache: 'no-store' });
        const body = await res.json().catch(() => null);
        if (!res.ok || body?.status === 'error') {
          setUser(null);
          setLoading(false);
          return;
        }
        const data = body?.data?.user ?? null;
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">読み込み中...</p>;
  }

  if (!user) {
    return (
      <p className="text-center mt-20 text-gray-500">
        ユーザーが見つかりません。
      </p>
    );
  }

  // プロフィール未作成（初回編集）の場合は空オブジェクトを渡す（PUT で upsert される）
  const initialProfile = user.profile ?? {};

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
          initialProfile={initialProfile}
          initialUserName={user.name}
          id={id}
        />
      </div>
    </main>
  );
}
