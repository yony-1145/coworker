'use client';
import Link from 'next/link';
import { Popup as MapPopup } from 'react-map-gl/maplibre';

type PopupProps = {
  type: 'user' | 'spot';
  item: any;
  lat: number;
  lng: number;
  message?: string;
  onClose: () => void;
};

export default function Popup({
  type,
  item,
  lat,
  lng,
  message,
  onClose,
}: PopupProps) {
  const name = type === 'user' ? item?.name : item?.title;
  const image =
    type === 'user'
      ? (item?.image ?? '/user-icons/default.png')
      : (item?.image ?? '/spot-icons/default.png');
  const href =
    type === 'user'
      ? `/users/${item?.id}`
      : `/spots/${item.id}?lat=${item.latitude}&lng=${item.longitude}`;

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
        <img
          src={image}
          alt={name ?? type}
          className="w-14 h-14 rounded-full object-cover mb-2"
        />
        <p className="text-sm text-center font-medium">
          <span className="font-semibold">{name ?? type}</span>
          {message && <span className="block text-xs mt-1">{message}</span>}
        </p>
      </Link>
    </MapPopup>
  );
}
