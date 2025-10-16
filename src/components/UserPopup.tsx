'use client';

import Link from 'next/link';
import { Popup } from 'react-map-gl/maplibre';

type UserPopupProps = {
  user: any;
  message?: string;
  lat: number;
  lng: number;
  onClose: () => void;
};

// UserPopupコンポーネント
export default function UserPopup({
  user,
  message,
  lat,
  lng,
  onClose,
}: UserPopupProps) {
  const userId = user?.id;
  return (
    <Popup
      longitude={lng}
      latitude={lat}
      anchor="bottom"
      onClose={onClose}
      closeButton={false}
      className="[&>div]:!bg-transparent [&>div]:!shadow-none [&>div]:!border-none"
    >
      {/* --- クリックでユーザーページへ遷移 --- */}
      <Link
        href={userId ? `/users/${userId}` : '#'}
        aria-label={
          user?.name ? `${user.name} の詳細ページへ` : 'ユーザー詳細ページへ'
        }
        className="flex flex-col items-center bg-white text-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 cursor-pointer hover:bg-gray-50 transition"
      >
        <img
          src={user?.image ?? '/user-icons/default.png'}
          alt={user?.name ?? 'User'}
          className="w-14 h-14 rounded-full object-cover mb-2"
        />
        <p className="text-sm text-center font-medium">
          <span className="font-semibold">{user?.name ?? 'User'}</span>
          {` ${message ?? ''}`}
        </p>
        {/* <span className="mt-2 text-xs text-blue-500 hover:underline">
          詳細ページを見る →
        </span> */}
      </Link>
    </Popup>
  );
}
