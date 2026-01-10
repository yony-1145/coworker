'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TagsField } from '@/components/TagsField';

/**
 * SpotDetailsPage
 * Step2：選択した位置情報にもとづき、スポット情報（名称・説明・タグ・画像）を入力して登録する画面。
 */
export default function SpotDetailsPage() {
  const router = useRouter();
  const params = useSearchParams();

  /** Step1 から受け取った位置情報と住所 */
  const latitude = parseFloat(params.get('lat') || '0');
  const longitude = parseFloat(params.get('lon') || '0');
  const address = params.get('address') || '';

  /** 入力値（スポット名・説明・タグ・画像） */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 画像選択時にプレビューを生成
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /**
   * 入力されたスポット情報を API に送信して登録
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('スポット名を入力してください');
      return;
    }

    setIsSubmitting(true);

    /** 画像を Base64 へ変換（画像ありのときのみ） */
    let imageBase64: string | null = null;
    if (image) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
      });
      reader.readAsDataURL(image);
      imageBase64 = await base64Promise;
    }

    /** タグの整形（空白削除） */
    const formattedTags = tags.map((t) => t.trim()).filter((t) => t.length > 0);

    /** API 送信 */
    const res = await fetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'cmhm5bc6x00019oq40rbmkjle', // TODO: 認証導入後に session.user.id に変更
        title,
        description,
        latitude,
        longitude,
        image: imageBase64,
        tags: formattedTags,
      }),
    });

    setIsSubmitting(false);

    if (res.ok) {
      router.push('/map');
    } else {
      alert('登録に失敗しました');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-4">
        {/* 基本情報 */}
        <h1 className="text-xl font-semibold text-gray-800">
          Step 2 / 2：スポット情報を入力
        </h1>

        <h2 className="text-l font-semibold text-gray-900 mt-2">基本情報</h2>

        {address && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">住所</p>
            <p className="text-sm text-gray-500">{address}</p>
          </div>
        )}

        {/* スポット名 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            スポット名
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：スターバックス 博多駅店"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 説明 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            説明
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Wi-Fi・電源あり / 落ち着いた雰囲気 など"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* タグセクション */}
        <div className="pt-4 border-t">
          <h2 className="text-l font-semibold text-gray-700 mb-2">タグ</h2>
          <TagsField
            tags={tags}
            onChange={setTags}
            placeholder="例：カフェ"
            maxTags={10}
          />
        </div>

        {/* 画像アップロード */}
        <div className="pt-4 border-t">
          <h2 className="text-l font-semibold text-gray-700 mb-2">画像</h2>

          <label className="block cursor-pointer">
            <div className="w-full h-44 border border-dashed rounded-lg flex items-center justify-center overflow-hidden hover:bg-gray-50">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-sm text-gray-400">クリックして画像を選択</p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* 投稿ボタン */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
      </div>
    </main>
  );
}
