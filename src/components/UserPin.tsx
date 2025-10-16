'use client';

import { Marker } from 'react-map-gl/maplibre';

type UserPinProps = {
  user: any;
  lat: number;
  lng: number;
  showName?: boolean;
  onClick?: () => void;
};

export default function UserPin({
  user,
  lat,
  lng,
  showName = true,
  onClick,
}: UserPinProps) {
  return (
    <Marker
      longitude={lng}
      latitude={lat}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick?.();
      }}
    >
      <div className="flex flex-col items-center transform -translate-y-1.5">
        <img
          src={user?.image ?? '/user-icons/default.png'}
          alt={user?.name ?? 'User'}
          className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover cursor-pointer"
        />
        {showName && (
          <span className="mt-1 bg-white text-gray-800 text-xs font-medium px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
            {user?.name ?? 'User'}
          </span>
        )}
      </div>
    </Marker>
  );
}
