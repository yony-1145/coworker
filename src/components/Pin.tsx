'use client';
import { Marker } from 'react-map-gl/maplibre';

type PinProps = {
  type: 'user' | 'spot';
  item: UserPin | SpotPin;
  lat: number;
  lng: number;
  showName?: boolean;
  onClick?: () => void;
};

type UserPin = {
  name?: string | null;
  image?: string | null;
};

type SpotPin = {
  title?: string | null;
  imageUrls?: string[] | null;
};

export default function Pin({
  type,
  item,
  lat,
  lng,
  showName = true,
  onClick,
}: PinProps) {
  if (!item) return null;

  const name = type === 'user' ? item?.name : item?.title;

  const image =
    type === 'user'
      ? (item?.image ?? '/user-icons/default.png')
      : (item?.imageUrls?.[0] ?? '/spot-icons/default.png');

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
          src={image}
          alt={name ?? type}
          className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover cursor-pointer"
        />
        {showName && (
          <span className="mt-1 bg-white text-gray-800 text-xs font-medium px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
            {name ?? type}
          </span>
        )}
      </div>
    </Marker>
  );
}
