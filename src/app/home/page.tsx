'use client';

import { useEffect, useState, useMemo } from 'react';
import { Map, Marker, Popup } from 'react-map-gl/maplibre';

export default function HomePage() {
  const [locations, setLocations] = useState([]);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);

  // デフォルト表示（東京）
  const initialView = {
    longitude: 139.6917,
    latitude: 35.6895,
    zoom: 10,
  };

  // API Routeからデータ取得
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/locations', { cache: 'no-store' });
      const data = await res.json();
      setLocations(data);
    };
    fetchData();
  }, []);

  // MarkerをuseMemoで生成
  const pins = useMemo(
    () =>
      locations.map((loc: any, index: number) => {
        const isSelected = popupInfo?.id === loc.id; // ✅ 現在選択中か判定

        return (
          <Marker
            key={`marker-${index}`}
            longitude={loc.lng}
            latitude={loc.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(isSelected ? null : loc); // 同じピンを押すと閉じる
            }}
          >
            <div className="flex flex-col items-center transform -translate-y-1.5">
              {/* --- ユーザーアイコン --- */}
              <img
                src={loc.user?.image ?? '/user-icons/default.png'}
                alt={loc.user?.name ?? 'UserName'}
                className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover cursor-pointer"
              />

              {/* --- ユーザー名ラベル（選択時は非表示） --- */}
              {!isSelected && (
                <span className="mt-1 bg-white text-gray-800 text-xs font-medium px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                  {loc.user?.name ?? 'User'}
                </span>
              )}
            </div>
          </Marker>
        );
      }),
    [locations, popupInfo]
  );

  return (
    <main className="w-full h-screen">
      <Map
        initialViewState={initialView}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        className="w-full h-full"
      >
        {pins}

        {popupInfo && (
          <Popup
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="[&>div]:!bg-transparent [&>div]:!shadow-none [&>div]:!border-none"
          >
            {/* === カード部分（Popupの中身） === */}
            <div className="flex flex-col items-center bg-white text-gray-800 rounded-xl shadow-lg p-3 border border-gray-100">
              <img
                src={popupInfo.user?.image ?? '/user-icons/default.png'}
                alt={popupInfo.user?.name ?? 'User'}
                className="w-14 h-14 rounded-full object-cover mb-2"
              />
              <p className="text-sm text-center font-medium">
                <span className="font-semibold">{popupInfo.user?.name}</span>
                {` ${popupInfo.message ?? ''}`}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </main>
  );
}
