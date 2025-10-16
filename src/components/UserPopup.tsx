'use client';

import { Popup } from 'react-map-gl/maplibre';

type UserPopupProps = {
  user: any;
  message?: string;
  lat: number;
  lng: number;
  onClose: () => void;
};

export default function UserPopup({
  user,
  message,
  lat,
  lng,
  onClose,
}: UserPopupProps) {
  return (
    <Popup
      longitude={lng}
      latitude={lat}
      anchor="bottom"
      onClose={onClose}
      closeButton={false}
      className="[&>div]:!bg-transparent [&>div]:!shadow-none [&>div]:!border-none"
    >
      <div className="flex flex-col items-center bg-white text-gray-800 rounded-xl shadow-lg p-3 border border-gray-100">
        <img
          src={user?.image ?? '/user-icons/default.png'}
          alt={user?.name ?? 'User'}
          className="w-14 h-14 rounded-full object-cover mb-2"
        />
        <p className="text-sm text-center font-medium">
          <span className="font-semibold">{user?.name}</span>
          {` ${message ?? ''}`}
        </p>
      </div>
    </Popup>
  );
}
