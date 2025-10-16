'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function UserDetailTabs({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'follow' | 'activity'>(
    'profile'
  );

  if (!user)
    return <div className="p-6 text-gray-500">ユーザー情報を読み込み中...</div>;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md">
      {/* --- ヘッダー --- */}
      <div className="flex items-center justify-center p-6 border-b border-gray-100">
        <Image
          src={user.image ?? '/user-icons/default.png'}
          alt={user.name ?? 'User'}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div className="ml-4">
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* --- タブボタン --- */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'profile', label: 'プロフィール' },
          { key: 'follow', label: 'フォロー' },
          { key: 'activity', label: 'アクティビティ' },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === key
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(key as any)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* --- タブ中身 --- */}
      <div className="p-6">
        {activeTab === 'profile' && (
          <div className="space-y-2 text-gray-700">
            <p>{user.location?.message ?? 'メッセージはありません。'}</p>
            <p className="text-sm text-gray-500">
              最終更新：
              {user.location?.updatedAt
                ? new Date(user.location.updatedAt).toLocaleString()
                : '不明'}
            </p>
          </div>
        )}

        {activeTab === 'follow' && (
          <div className="text-gray-500 text-sm">
            フォロー機能は今後追加予定です。
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-gray-500 text-sm">
            アクティビティ機能は準備中です。
          </div>
        )}
      </div>
    </div>
  );
}
