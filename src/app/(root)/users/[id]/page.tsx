import { baseApiUrl } from 'mapbox-gl';
import Link from 'next/link';

interface UserProfile {
  id: string;
  displayName: string;
  iconUrl?: string;
  headline?: string;
  occupation?: string;
  affiliation?: string;
  location?: string;
  age?: number;
  links?: Record<string, string>;
  bioText?: string;
  tags?: string[];
}
export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const isOwner = true; // 後でNextAuth制御に置換
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 相対パスでfetch
  const res = await fetch(`${baseUrl}/api/users/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch user:', res.status, res.statusText);
    return (
      <div className="text-center py-20 text-gray-500">
        ユーザーが見つかりません。
      </div>
    );
  }

  const profile: UserProfile = await res.json();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-10 border border-gray-100 space-y-8">
        {/* ヘッダー */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative w-24 h-24 shrink-0">
            <img
              src={profile.iconUrl || '/user-icons/cat5.png'}
              alt={profile.displayName}
              className="w-24 h-24 rounded-full shadow-md border-4 border-white object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {profile.displayName}
                </h1>
              </div>

              {isOwner && (
                <Link
                  href={`/users/${id}/edit`}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  プロフィールを編集
                </Link>
              )}
            </div>

            {profile.headline && (
              <p className="text-lg text-gray-600 italic border-l-4 border-indigo-200 pl-4">
                "{profile.headline}"
              </p>
            )}
          </div>
        </div>

        {/* 自己紹介 */}
        {(profile.bioText || profile.occupation || profile.affiliation) && (
          <section className="border-t pt-4 space-y-3 text-gray-700">
            <h2 className="text-xl font-semibold text-gray-900">自己紹介</h2>

            {(profile.occupation || profile.affiliation) && (
              <p className="text-gray-500">
                {profile.occupation && `職業: ${profile.occupation} `}
                {profile.affiliation && `所属: ${profile.affiliation}`}
              </p>
            )}

            {profile.bioText && (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line border-l-4 border-indigo-200 pl-4">
                {profile.bioText}
              </p>
            )}
          </section>
        )}

        {/* SNSリンク */}
        {profile.links && Object.values(profile.links).length > 0 && (
          <section className="border-t pt-4 space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">SNSリンク</h2>
            <div className="flex flex-col gap-3 mt-3">
              {profile.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-5 py-3 shadow-sm hover:from-indigo-50 hover:border-indigo-300 transition-all duration-200"
                >
                  <span className="text-gray-700 group-hover:text-indigo-700 font-medium truncate">
                    {link.label}
                  </span>
                  <span className="text-gray-400 group-hover:text-indigo-500 text-sm">
                    →
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* タグ */}
        {profile.tags && profile.tags.length > 0 && (
          <section className="border-t pt-4 space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              興味・活動領域
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
