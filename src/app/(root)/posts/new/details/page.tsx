'use client';

import { useEffect, useState } from 'react';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 画像プレビュー用の一時URLを管理する（選び直し/離脱時に破棄）
   * - File はそのまま <img> に渡せないため createObjectURL でURL化する
   * - 不要になったURLは revokeObjectURL で破棄してメモリリークを防ぐ
   */
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  /**
   * 画像選択
   * - この時点ではStorageへアップロードしない（保存時にまとめて行う）
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  /**
   * 入力されたスポット情報を API に送信して登録
   * - 保存時に /api/uploads へ画像を送信 → URL取得 → /api/spots にURLを送る
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('スポット名を入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      /** タグの整形（空白削除・空要素除去） */
      const formattedTags = tags
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      /** 保存時に画像アップロード（任意） */
      let imageUrls: string[] = [];
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('type', 'spot');

        const uploadRes = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json().catch(() => null);

        if (!uploadRes.ok || uploadData?.ok === false) {
          const msg =
            uploadData?.error?.message ?? '画像のアップロードに失敗しました';
          alert(msg);
          return;
        }

        imageUrls = [uploadData.url];
      }

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
          address,
          imageUrls,
          tags: formattedTags,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok === false) {
        const msg = data?.error?.message ?? '登録に失敗しました';
        alert(msg);
        return;
      }

      router.push('/map');
    } catch (err) {
      console.error(err);
      alert('登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-4">
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

        <div className="pt-4 border-t">
          <h2 className="text-l font-semibold text-gray-700 mb-2">タグ</h2>
          <TagsField
            tags={tags}
            onChange={setTags}
            placeholder="例：カフェ"
            maxTags={10}
          />
        </div>

        <div className="pt-4 border-t">
          <h2 className="text-l font-semibold text-gray-700 mb-2">画像</h2>

          <label className="block cursor-pointer">
            <div className="w-full h-44 border border-dashed rounded-lg flex items-center justify-center overflow-hidden hover:bg-gray-50">
              {previewUrl ? (
                <img
                  src={previewUrl}
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
