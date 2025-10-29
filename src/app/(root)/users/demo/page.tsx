'use client';

import { Github, FileText, LucideX } from 'lucide-react';

export default function UserProfilePage() {
  const profile = {
    displayName: 'よねもと',
    iconUrl: '/images/sample-icon.png',
    headline: '地方からWeb開発を発信しています',
    occupation: 'フリーランスエンジニア',
    affiliation: '個人事業主',
    location: '福岡県',
    age: 24,
    links: [
      { label: 'GitHub', url: 'https://github.com/yony-1145' },
      { label: 'X', url: 'https://x.com/yony1145' },
      { label: 'note', url: 'https://note.com/' },
    ],
    bioText: `福岡を拠点にフリーランスでWeb制作を行っています。
今後は地方の人たちをつなぐ仕組みをつくりたいです。`,
    tags: ['Web開発', 'リモートワーク', '地域活性化'],
  };

  // ✅ 最新Lucide仕様に合わせてXアイコンをLucideXに変更
  const iconMap: Record<string, JSX.Element> = {
    GitHub: <Github className="w-4 h-4" />,
    X: <LucideX className="w-4 h-4" />,
    note: <FileText className="w-4 h-4" />,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-10 border border-gray-100 space-y-10">
        {/* ヘッダー */}
        <div className="flex items-center gap-6">
          <img
            src={profile.iconUrl}
            alt={profile.displayName}
            className="w-28 h-28 rounded-full shadow-md border-4 border-white"
          />
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {profile.displayName}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {profile.location} / {profile.age}歳
            </p>
          </div>
        </div>

        {/* headline */}
        <p className="text-lg text-gray-600 italic border-l-4 border-indigo-200 pl-4">
          "{profile.headline}"
        </p>

        {/* 職業・所属 */}
        <div className="flex flex-wrap gap-x-8 text-gray-700 border-t pt-6">
          <p className="font-medium">
            職業: <span className="font-normal">{profile.occupation}</span>
          </p>
          <p className="font-medium">
            所属: <span className="font-normal">{profile.affiliation}</span>
          </p>
        </div>

        {/* SNSリンク */}
        <div className="flex gap-3 flex-wrap border-t pt-6">
          {profile.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border text-gray-600 shadow-sm hover:bg-indigo-50 hover:text-indigo-700 transition"
            >
              {iconMap[link.label] ?? <span>🔗</span>}
              <span className="text-sm font-medium">{link.label}</span>
            </a>
          ))}
        </div>

        {/* 自己紹介 */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">自己紹介</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line border-l-4 border-indigo-200 pl-4">
            {profile.bioText}
          </p>
        </div>

        {/* タグ */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            興味・活動領域
          </h2>
          <div className="flex flex-wrap gap-3">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-full text-sm shadow-sm hover:from-indigo-100 hover:to-blue-100 transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
