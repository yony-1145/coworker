'use client';
import { useEffect } from 'react';
import { Map, Marker } from 'react-map-gl/maplibre';

type SpotDetailProps = {
  spot: {
    title: string;
    description?: string;
    imageUrls?: string[];
    latitude: number;
    longitude: number;
    avgRating?: number | null;
    user: { name: string; image?: string };
    tags: { name: string }[];
    comments: {
      id: string;
      content: string;
      user: { name: string; image?: string };
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
  } = spot;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500">by {user.name}</p>
        </div>
        {avgRating && (
          <span className="text-yellow-500 font-semibold">★ {avgRating}</span>
        )}
      </div>

      {/* Image */}
      {imageUrls && imageUrls.length > 0 && (
        <img
          src={imageUrls[0]}
          alt={title}
          className="w-full h-64 object-cover rounded-lg shadow"
        />
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.name}
            className="bg-gray-100 text-sm px-3 py-1 rounded-full"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      {/* Map */}
      <div className="h-60 rounded-lg overflow-hidden">
        <Map
          initialViewState={{ latitude, longitude, zoom: 15 }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        >
          <Marker latitude={latitude} longitude={longitude} />
        </Map>
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-lg font-semibold mb-2">コメント</h2>
        {comments.length === 0 && (
          <p className="text-gray-500">まだコメントはありません。</p>
        )}
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="border-b pb-2">
              <p className="text-sm text-gray-600">by {c.user.name}</p>
              <p>{c.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
