'use client';

import { useState } from 'react';

export default function PostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- geocode API呼び出し ---
  const geocodeAddress = async (address: string) => {
    const res = await fetch('/api/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    if (!res.ok) return null;
    return await res.json();
  };

  // --- フォーム送信 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 住所から座標を取得
    const coords = await geocodeAddress(address);
    if (!coords) {
      alert('住所から位置を取得できませんでした。');
      setIsSubmitting(false);
      return;
    }

    // /api/spots に登録リクエストを送信
    const res = await fetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '37c18ff7-c0c5-42a0-8925-fa2ae95e1f9a', // 仮のユーザー
        title,
        description,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    });

    setIsSubmitting(false);

    if (res.ok) {
      alert('スポットを登録しました！');
      setTitle('');
      setDescription('');
      setAddress('');
    } else {
      alert('登録に失敗しました。');
    }
  };

  return (
    <main className="max-w-lg mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6">新しいスポットを投稿</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
            placeholder="例：スターバックス天神"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            説明
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
            placeholder="Wi-Fi・電源あり"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            住所
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="例：福岡市中央区天神2丁目"
            className="mt-1 w-full border rounded-md p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
      </form>
    </main>
  );
}
