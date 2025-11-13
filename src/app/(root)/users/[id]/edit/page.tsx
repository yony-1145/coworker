'use client';

import {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  use,
  useRef,
} from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  displayName: string;
  iconUrl?: string;
  headline?: string;
  occupation?: string;
  affiliation?: string;
  links?: string[];
  bioText?: string;
  tags?: string[];
}

export default function UserProfileEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        setProfile(data);
        setPreview(data.iconUrl || null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // <input type="file"> で選択された最初のファイル（fileInputRef）を取得
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      const filePath = `${profile.id}_${Date.now()}`;
      // Supabase Storageにインプットで選択されたファイルをアップロード
      const { error: uploadError } = await supabase.storage
        .from('user-icons')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // アップロードしたファイルを取得し、公開URLを取得
      const { data } = supabase.storage
        .from('user-icons')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // 公開URLにプレビュー更新
      setPreview(publicUrl);
      setProfile({ ...profile, iconUrl: publicUrl });
      alert(
        '画像をアップロードしました。保存ボタンを押して変更を確定してください。'
      );
    } catch (err) {
      console.error('Upload failed:', err);
      alert('画像のアップロードに失敗しました。');
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-500">読み込み中...</p>;
  if (!profile)
    return (
      <p className="text-center mt-20 text-gray-500">
        ユーザーが見つかりません。
      </p>
    );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // プロフィール編集フォームの送信処理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // APIに送信するデータを整形
    const payload = {
      ...profile,
      links: profile.links ?? {}, // nullなら[]にする
      tags: profile.tags ?? [], /// nullなら[]にする
    };

    try {
      //　ユーザデータを PUT API に送信
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`更新に失敗しました (${res.status})`);
      alert('プロフィールを保存しました');
      // 成功時：通知を表示し、ユーザー詳細ページへ遷移
      router.push(`/users/${id}`);
    } catch (err) {
      console.error(err);
      alert('エラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-10 border border-gray-100 space-y-8">
        {/* タイトル＋保存ボタン */}
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

        <form
          id="profileForm"
          onSubmit={handleSubmit}
          className="space-y-8 overflow-y-auto max-h-[calc(100vh-180px)] pr-1"
        >
          {/* ヘッダー */}
          <div className="flex items-center gap-6">
            <div
              className="relative w-24 h-24 cursor-pointer"
              onClick={handleImageClick}
            >
              <img
                src={preview || '/user-icons/cat5.png'}
                alt={profile.displayName}
                className="w-24 h-24 rounded-full shadow-md border-4 border-white object-cover hover:opacity-80 transition"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                表示名
              </label>
              <input
                type="text"
                name="displayName"
                value={profile.displayName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                placeholder="名前を入力"
              />
            </div>
          </div>

          {/* ひとこと */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              ひとこと
            </label>
            <input
              type="text"
              name="headline"
              value={profile.headline || ''}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              placeholder="例: 地方からWeb開発を発信しています"
            />
          </div>

          {/* 職業・所属・自己紹介 */}
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              職業・所属・自己紹介
            </h2>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[45%]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  職業
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={profile.occupation || ''}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                  placeholder="例: フリーランスエンジニア"
                />
              </div>

              <div className="flex-1 min-w-[45%]">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  所属
                </label>
                <input
                  type="text"
                  name="affiliation"
                  value={profile.affiliation || ''}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                  placeholder="例: 個人事業主"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                自己紹介
              </label>
              <textarea
                name="bioText"
                value={profile.bioText || ''}
                onChange={handleChange}
                rows={3}
                placeholder="あなたの活動や目標について書いてください"
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>
          </div>

          {/* SNSリンク */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              SNSリンク
            </h2>
            <div className="flex flex-col gap-2">
              {/* DBから取得したリンクの配列をループで表示 */}
              {(profile.links || []).map((url, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
                >
                  <input
                    type="url"
                    value={url}
                    // URLの変更、prevが
                    onChange={(e) =>
                      // インデックスが一致するリンクを更新
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              links: prev.links?.map((l, idx) =>
                                idx === i ? e.target.value : l
                              ),
                            }
                          : prev
                      )
                    }
                    placeholder="URLを入力"
                    className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800"
                  />
                  <button
                    type="button"
                    // リンクの削除
                    onClick={() =>
                      // インデックスが一致するリンクを配列から削除
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              links: prev.links?.filter((_, idx) => idx !== i),
                            }
                          : prev
                      )
                    }
                    className="text-indigo-500 hover:text-indigo-700 font-medium"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                // リンクの追加、空の要素を追加
                onClick={() =>
                  setProfile((prev) =>
                    prev
                      ? { ...prev, links: [...(prev.links || []), ''] }
                      : prev
                  )
                }
                className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
              >
                ＋ SNSリンクを追加
              </button>
            </div>
          </div>

          {/* タグ */}
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              興味・活動領域
            </h2>
            <div className="flex flex-wrap gap-2">
              {(profile.tags || []).map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-300 rounded-full text-sm"
                >
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) =>
                      // インデックスが一致するタグを更新
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              tags: prev.tags?.map((t, idx) =>
                                idx === i ? e.target.value : t
                              ),
                            }
                          : prev
                      )
                    }
                    className="bg-transparent focus:outline-none w-20"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      // インデックスが一致するタグを配列から削除
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              tags: prev.tags?.filter((_, idx) => idx !== i),
                            }
                          : prev
                      )
                    }
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() =>
                  // タグの追加、空の要素を追加
                  setProfile((prev) =>
                    prev ? { ...prev, tags: [...(prev.tags || []), ''] } : prev
                  )
                }
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700"
              >
                ＋
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
