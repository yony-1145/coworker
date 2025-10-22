'use client';

import { useState } from 'react';

export default function PostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`タイトル: ${title}\n説明: ${description}\n住所: ${address}`);
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
            className="mt-1 w-full border rounded-md p-2"
            placeholder="例：福岡市中央区天神2丁目"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
        >
          投稿する
        </button>
      </form>
    </main>
  );
}
