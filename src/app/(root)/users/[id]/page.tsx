import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth/next';
import type { AuthOptions } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { cookies, headers } from 'next/headers';

// TODO: 型定義を共通化・修正予定
type UserProfile = {
  id: string;
  userId: string;
  displayName: string;
  iconUrl?: string | null;
  headline?: string | null;
  occupation?: string | null;
  affiliation?: string | null;
  location?: string | null;
  age?: number | null;
  links?: unknown;
  bioText?: string | null;
  tags?: unknown;
};

// TODO: 型定義を共通化・修正予定
type UserResponse = {
  id: string;
  name: string;
  image?: string | null;
  profile?: UserProfile | null;
};

// Todo:修正予定。ファイル移動、必要有無も要検討
function safeHostname(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

async function resolveBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL;
  if (envUrl) return envUrl;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  const headerList = await headers();
  const host =
    headerList.get('x-forwarded-host') ?? headerList.get('host');
  const proto = headerList.get('x-forwarded-proto') ?? 'https';
  return host ? `${proto}://${host}` : 'http://localhost:3000';
}

/**
 * ユーザープロフィール表示ページ
 * - 本人の場合のみ編集リンクを表示
 */
export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions as AuthOptions);
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id;
  const isOwner = sessionUserId === id;
  const baseUrl = await resolveBaseUrl();

  const cookie = await cookies();
  const cookieHeader = cookie.toString();

  const res = await fetch(`${baseUrl}/api/users/${id}`, {
    cache: 'no-store',
    headers: {
      cookie: cookieHeader,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok || body?.status === 'error') {
    return (
      <div className="text-center py-20 text-gray-500">
        {body?.message ?? 'ユーザーが見つかりません。'}
      </div>
    );
  }

  const user: UserResponse | null = body?.data?.user ?? null;
  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        ユーザーが見つかりません。
      </div>
    );
  }

  const profile = user.profile ?? null;
  const displayName = user.name;
  const iconSrc = profile?.iconUrl || '/user-icons/default.png';

  const links = Array.isArray(profile?.links)
    ? (profile?.links as string[])
    : [];
  const tags = Array.isArray(profile?.tags) ? (profile?.tags as string[]) : [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-10 border border-gray-100 space-y-8">
        {/* ヘッダー */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative w-24 h-24 shrink-0">
            <Image
              src={iconSrc}
              alt={displayName}
              width={96}
              height={96}
              unoptimized
              className="w-24 h-24 rounded-full shadow-md border-4 border-white object-cover"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {displayName}
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

            {profile?.headline && (
              <p className="text-lg text-gray-600 italic border-l-4 border-indigo-200 pl-4">
                「{profile.headline}」
              </p>
            )}
          </div>
        </div>

        {!profile?.headline && (
          <p className="text-lg text-gray-600 italic pl-4">
            編集ボタンから自分だけのプロフィールを作成しましょう
          </p>
        )}

        {/* 自己紹介 */}
        {(profile?.bioText || profile?.occupation || profile?.affiliation) && (
          <section className="border-t pt-4 space-y-3 text-gray-700">
            <h2 className="text-xl font-semibold text-gray-900">自己紹介</h2>

            {(profile?.occupation || profile?.affiliation) && (
              <p className="text-gray-500">
                {profile?.occupation && `職業: ${profile.occupation} `}
                {profile?.affiliation && `所属: ${profile.affiliation}`}
              </p>
            )}

            {profile?.bioText && (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words border-l-4 border-indigo-200 pl-4">
                {profile.bioText}
              </p>
            )}
          </section>
        )}

        {/* SNSリンク */}
        {links.length > 0 && (
          <section className="border-t pt-4 space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">SNSリンク</h2>
            <div className="flex flex-col gap-3 mt-3">
              {links.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-5 py-3 shadow-sm hover:from-indigo-50 hover:border-indigo-300 transition-all duration-200"
                >
                  <span className="text-gray-700 group-hover:text-indigo-700 font-medium truncate">
                    {safeHostname(url)}
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
        {tags.length > 0 && (
          <section className="border-t pt-4 space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              興味・活動領域
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
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
