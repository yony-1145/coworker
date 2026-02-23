'use client';

import Image from 'next/image';
import { Map, Marker } from 'react-map-gl/maplibre';
import Link from 'next/link';
import { getDefaultSpotIconByGenre } from '@/lib/spotIcons';

const GENRE_LABEL: Record<string, string> = {
  CAFE: 'カフェ',
  COWORKING: 'コワーキングスペース',
  OTHER: 'その他',
};

const CROWD_LABEL: Record<string, string> = {
  LOW: '空いている',
  MID: '普通',
  HIGH: '混雑している',
};

type SpotDetailProps = {
  spot: {
    id: string;
    title: string;
    description?: string | null;
    address?: string | null;
    openingHours?: string | null;
    genre?: string;
    crowdLevel?: string;
    hasWifi?: boolean;
    hasPower?: boolean;
    hasQuietSpace?: boolean;
    hasLargeTable?: boolean;
    hasPhoneCallOK?: boolean;
    hasMeetingSpace?: boolean;
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
    address,
    openingHours,
    genre,
    crowdLevel,
    hasWifi,
    hasPower,
    hasQuietSpace,
    hasLargeTable,
    hasPhoneCallOK,
    hasMeetingSpace,
    imageUrls,
    latitude,
    longitude,
    user,
    createdAt,
  } = spot;

  const urls = Array.isArray(imageUrls) ? imageUrls : [];
  const displayUrls =
    urls.length > 0 ? urls : [getDefaultSpotIconByGenre(genre as 'CAFE' | 'COWORKING' | 'OTHER' | undefined)];
  const hasDescription = Boolean(description && description.trim() !== '');
  const equipment = [
    hasWifi && 'Wi-Fiあり',
    hasPower && '電源あり',
    hasQuietSpace && '静かな空間',
    hasLargeTable && '広いテーブル',
    hasPhoneCallOK && '通話OK',
    hasMeetingSpace && 'ミーティング可',
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 md:p-10 border border-gray-200 dark:border-gray-700 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            投稿者：
            <Link
              href={`/users/${user.id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {user.name}
            </Link>
            <span className="ml-2 text-gray-400 dark:text-gray-500 text-xs">
              （{new Date(createdAt).toLocaleDateString()} 投稿）
            </span>
          </p>
        </header>

        <section className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {displayUrls.map((url, i) => (
              <Image
                key={i}
                src={url}
                alt={`${title} ${i + 1}`}
                width={320}
                height={128}
                unoptimized
                className="w-full h-32 object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        </section>

        {address && (
          <section className="space-y-1">
            <p className="block text-sm font-medium text-gray-600 dark:text-gray-400">登録場所</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{address}</p>
          </section>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {genre != null && (
            <div>
              <p className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                ジャンル
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {GENRE_LABEL[genre] ?? genre}
              </p>
            </div>
          )}
          {crowdLevel != null && (
            <div>
              <p className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                混雑度
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {CROWD_LABEL[crowdLevel] ?? crowdLevel}
              </p>
            </div>
          )}
        </section>

        {openingHours != null && openingHours !== '' && (
          <section className="space-y-1">
            <p className="block text-sm font-medium text-gray-600 dark:text-gray-400">営業時間</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{openingHours}</p>
          </section>
        )}

        <section className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">設備</h2>
        {equipment.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {equipment.map((label) => (
              <span
                key={label}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full font-medium border border-gray-200 dark:border-gray-700"
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            設備情報が登録されていません。
          </p>
        )}
        </section>

        <section className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">説明</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line break-words">
            {hasDescription ? description : '説明はまだ登録されていません。'}
          </p>
        </section>

        <section className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">地図</h2>
          <div className="h-60 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Map
              initialViewState={{ latitude, longitude, zoom: 15 }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            >
              <Marker latitude={latitude} longitude={longitude} />
            </Map>
          </div>
        </section>

        <section className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">コメント</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">機能追加予定</p>
        </section>
      </div>
    </main>
  );
}
