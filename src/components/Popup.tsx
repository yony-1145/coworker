'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Popup as MapPopup } from 'react-map-gl/maplibre';

type PopupProps = {
  type: 'user' | 'spot';
  item: UserPopup | SpotPopup;
  lat: number;
  lng: number;
  message?: string;
  onClose: () => void;
};

type UserPopup = {
  id?: string;
  name?: string | null;
  image?: string | null;
};

type SpotPopup = {
  id?: string;
  title?: string | null;
  imageUrls?: string[] | null;
  latitude?: number | null;
  longitude?: number | null;
  hasWifi?: boolean;
  hasPower?: boolean;
  hasQuietSpace?: boolean;
  hasLargeTable?: boolean;
  hasPhoneCallOK?: boolean;
  hasMeetingSpace?: boolean;
};

const MESSAGE_LIMIT = 30;

const truncateMessage = (value?: string) => {
  if (!value) return '';
  if (value.length <= MESSAGE_LIMIT) return value;
  return `${value.slice(0, MESSAGE_LIMIT)}…`;
};

export default function Popup({
  type,
  item,
  lat,
  lng,
  message,
  onClose,
}: PopupProps) {
  if (!item) return null;

  const isUser = type === 'user';
  const userItem = isUser ? (item as UserPopup) : null;
  const spotItem = !isUser ? (item as SpotPopup) : null;

  const name = isUser ? userItem?.name : spotItem?.title;
  const equipment = spotItem
    ? ([
        spotItem.hasWifi && 'Wi-Fiあり',
        spotItem.hasPower && '電源あり',
        spotItem.hasQuietSpace && '静かな空間',
        spotItem.hasLargeTable && '広いテーブル',
        spotItem.hasPhoneCallOK && '通話OK',
        spotItem.hasMeetingSpace && 'ミーティング可',
      ].filter(Boolean) as string[])
    : [];

  const image = isUser
    ? (userItem?.image ?? '/user-icons/default.png')
    : (spotItem?.imageUrls?.[0] ?? '/spot-icons/default.png');

  const trimmedMessage = message?.trim() ?? '';
  const shownMessage = trimmedMessage ? truncateMessage(trimmedMessage) : '';

  const href = isUser
    ? `/users/${userItem?.id}`
    : `/spots/${spotItem?.id}?lat=${spotItem?.latitude}&lng=${spotItem?.longitude}`;

  return (
    <MapPopup
      longitude={lng}
      latitude={lat}
      anchor="bottom"
      onClose={onClose}
      closeButton={false}
      className="[&>div]:!bg-transparent [&>div]:!shadow-none [&>div]:!border-none"
    >
      <Link
        href={href}
        className="flex flex-col items-center bg-white text-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 cursor-pointer hover:bg-gray-50 transition"
      >
        <Image
          src={image}
          alt={name ?? type}
          width={56}
          height={56}
          unoptimized
          className="w-14 h-14 rounded-full object-cover mb-2"
        />
        <p className="text-sm text-center font-medium">
          <span className="font-semibold">{name ?? type}</span>
          {shownMessage && (
            <span className="block text-xs mt-1">{shownMessage}</span>
          )}
        </p>
        {equipment.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 justify-center max-w-[220px]">
            {equipment.map((label) => (
              <span
                key={label}
                className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-medium border border-gray-200"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </Link>
    </MapPopup>
  );
}
