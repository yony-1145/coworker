'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SpotDetailsPage() {
  const router = useRouter();
  const params = useSearchParams();

  // 前画面から受け取るデータ
  const title = params.get('title') || '';
  const latitude = parseFloat(params.get('lat') || '0');
  const longitude = parseFloat(params.get('lon') || '0');

  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageBase64: string | null = null;
    if (image) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
      });
      reader.readAsDataURL(image);
      imageBase64 = await base64Promise;
    }

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const res = await fetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '37c18ff7-c0c5-42a0-8925-fa2ae95e1f9a',
        title,
        description,
        latitude,
        longitude,
        image: imageBase64,
        tags: tagList,
      }),
    });

    setIsSubmitting(false);

    if (res.ok) {
      alert('スポットを登録しました！');
      router.push('/map');
    } else {
      alert('登録に失敗しました。');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">詳細を入力</h1>

        <p className="text-base text-gray-500 mb-6">
          <strong>{title}</strong>
          {/* <br />
          緯度: {latitude.toFixed(5)} / 経度: {longitude.toFixed(5)} */}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Wi-Fi・電源あり / 落ち着いた雰囲気"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タグ（カンマ区切り）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例：カフェ, Wi-Fi, 電源"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <div className="w-full border border-dashed border-gray-400 rounded-lg px-3 py-8 text-center hover:bg-gray-50 transition">
                  {image ? (
                    <p className="text-sm text-gray-600">{image.name}</p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      クリックして画像を選択
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-16 h-16 rounded-md object-cover border"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? '登録中...' : '登録する'}
          </button>
        </form>
      </div>
    </main>
  );
}
