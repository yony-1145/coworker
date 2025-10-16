// src/app/users/[id]/page.tsx
import UserDetailTabs from '@/components/UserDetailTabs';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/users/${id}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return (
      <main className="flex justify-center items-center h-screen text-gray-600">
        ユーザー情報の取得に失敗しました
      </main>
    );
  }

  const user = await res.json();

  if (!user || user.error) {
    return (
      <main className="flex justify-center items-center h-screen text-gray-600">
        ユーザーが見つかりません
      </main>
    );
  }

  // userが存在しない場合
  if (!user.image && !user.name) {
    return (
      <main className="flex justify-center items-center h-screen text-gray-600">
        データを読み込み中...
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center h-screen text-gray-800 p-4">
      <UserDetailTabs user={user} />
    </main>
  );
}
