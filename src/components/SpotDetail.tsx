'use client';

import { Map, Marker } from 'react-map-gl/maplibre';
import Link from 'next/link';

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
  const equipment = [
    hasWifi && 'Wi-Fiあり',
    hasPower && '電源あり',
    hasQuietSpace && '静かな空間',
    hasLargeTable && '広いテーブル',
    hasPhoneCallOK && '通話OK',
    hasMeetingSpace && 'ミーティング可',
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            投稿者：
            <Link
              href={`/users/${user.id}`}
              className="text-blue-600 hover:underline"
            >
              {user.name}
            </Link>
            <span className="ml-2 text-gray-400 text-xs">
              （{new Date(createdAt).toLocaleDateString()} 投稿）
            </span>
          </p>
        </div>
      </header>

      <div className="border-t pt-4">
        {urls.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {urls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${title} ${i + 1}`}
                className="w-full h-32 object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        ) : (
          <div className="w-full min-h-[120px] bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">
            画像はありません
          </div>
        )}
      </div>

      {address && (
        <div>
          <p className="block text-sm font-medium text-gray-600 mb-1">
            登録場所
          </p>
          <p className="text-sm text-gray-700">{address}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {genre != null && (
          <div>
            <p className="block text-sm font-medium text-gray-600 mb-1">
              ジャンル
            </p>
            <p className="text-sm text-gray-700">
              {GENRE_LABEL[genre] ?? genre}
            </p>
          </div>
        )}
        {crowdLevel != null && (
          <div>
            <p className="block text-sm font-medium text-gray-600 mb-1">
              混雑度
            </p>
            <p className="text-sm text-gray-700">
              {CROWD_LABEL[crowdLevel] ?? crowdLevel}
            </p>
          </div>
        )}
      </div>

      {openingHours != null && openingHours !== '' && (
        <div>
          <p className="block text-sm font-medium text-gray-600 mb-1">
            営業時間
          </p>
          <p className="text-sm text-gray-700">{openingHours}</p>
        </div>
      )}

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">設備</h2>
        {equipment.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {equipment.map((label) => (
              <span
                key={label}
                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium border border-gray-200"
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            設備情報が登録されていません。
          </p>
        )}
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">説明</h2>
        <p className="text-sm text-gray-500">説明は現在準備中です。</p>
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">地図</h2>
        <div className="h-60 rounded-lg overflow-hidden">
          <Map
            initialViewState={{ latitude, longitude, zoom: 15 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          >
            <Marker latitude={latitude} longitude={longitude} />
          </Map>
        </div>
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">コメント</h2>
        <p className="text-sm text-gray-500">コメント機能は現在準備中です。</p>
      </div>
    </div>
  );
}
