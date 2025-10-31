'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';

interface UserProfile {
  id: string;
  displayName: string;
  iconUrl?: string;
  headline?: string;
  occupation?: string;
  affiliation?: string;
  links?: Record<string, string>;
  bioText?: string;
  tags?: string[];
}

export default function UserProfileEditPage({
  params,
}: {
  params: { id: string };
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/users/${params.id}`, { cache: 'no-store' });
      const data = await res.json();
      setProfile(data);
      setPreview(data.iconUrl || null);
      setLoading(false);
    };
    fetchProfile();
  }, [params.id]);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('送信データ:', profile);
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
            <div className="relative w-24 h-24">
              <img
                src={preview || '/images/sample-icon.png'}
                alt={profile.displayName}
                className="w-24 h-24 rounded-full shadow-md border-4 border-white object-cover"
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
              {Object.entries(profile.links || {}).map(([key, url], i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
                >
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              links: { ...prev.links, [key]: e.target.value },
                            }
                          : prev
                      )
                    }
                    placeholder="URLを入力"
                    className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setProfile((prev) => {
                        if (!prev) return prev;
                        const updated = { ...prev.links };
                        delete updated[key];
                        return { ...prev, links: updated };
                      })
                    }
                    className="text-indigo-500 hover:text-indigo-700 font-medium"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setProfile((prev) =>
                    prev
                      ? {
                          ...prev,
                          links: { ...prev.links, [`link${Date.now()}`]: '' },
                        }
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
