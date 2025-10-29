'use client';

import { Map, Marker } from 'react-map-gl/maplibre';
import Link from 'next/link';

type SpotDetailProps = {
  spot: {
    id: string;
    title: string;
    description?: string | null;
    imageUrls?: string[] | null;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
    avgRating?: number | null;
    user: { id: string; name: string; image?: string | null };
    tags: { name: string }[];
    comments: {
      id: string;
      content: string;
      createdAt: string;
      user: { id: string; name: string; image?: string | null };
    }[];
    ratings: {
      id: string;
      score: number;
      createdAt: string;
      user: { id: string; name: string; image?: string | null };
    }[];
  };
};

export default function SpotDetail({ spot }: SpotDetailProps) {
  const {
    title,
    description,
    imageUrls,
    latitude,
    longitude,
    user,
    avgRating,
    tags,
    comments,
    ratings,
    createdAt,
  } = spot;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      {/* ヘッダー */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            投稿者：
            <Link
              href={`/users/${user.id}`}
              className="text-blue-600 hover:underline"
            ></Link>
            {user.name}
            <span className="ml-2 text-gray-400 text-xs">
              （{new Date(createdAt).toLocaleDateString()} 投稿）
            </span>
          </p>
        </div>
        {avgRating != null && (
          <div className="flex items-center gap-1 text-yellow-500 font-semibold">
            <span>★</span>
            <span>{avgRating.toFixed(1)}</span>
          </div>
        )}
      </header>

      {/* 画像 */}
      <section>
        {imageUrls && imageUrls.length > 0 ? (
          <img
            src={imageUrls[0]}
            alt={title}
            className="w-full h-64 object-cover rounded-lg shadow"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">
            画像はありません
          </div>
        )}
      </section>

      {/* 説明 */}
      {description && (
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">説明</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {description}
          </p>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">特徴</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.name}
                className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-100"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* マップ */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">地図</h2>
        <div className="h-60 rounded-lg overflow-hidden">
          <Map
            initialViewState={{ latitude, longitude, zoom: 15 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          >
            <Marker latitude={latitude} longitude={longitude} />
          </Map>
        </div>
      </section>

      {/* 評価（仮） */}
      {ratings.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">評価</h2>
          <ul className="space-y-3">
            {ratings.map((r) => (
              <li key={r.id} className="border-b border-gray-100 pb-2">
                <p className="text-sm text-gray-600">
                  {r.user.name}：<span className="text-yellow-500">★</span>
                  {r.score}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* コメント（仮） */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">コメント</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500">まだコメントはありません。</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li
                key={c.id}
                className="border-b border-gray-100 pb-3 flex flex-col"
              >
                <span className="text-sm text-gray-600 mb-1">
                  {c.user.name}
                </span>
                <p className="text-gray-800">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
