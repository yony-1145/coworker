'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Map, Marker, Popup } from 'react-map-gl/maplibre';

export default function HomePage() {
  const [locations, setLocations] = useState([]);
  const [myLocation, setMyLocation] = useState<any | null>(null);
  const [myUser, setMyUser] = useState<any | null>(null); // 自分のユーザー情報
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);

  const currentUserEmail = 'yone@example.com';

  const initialView = {
    longitude: 139.6917,
    latitude: 35.6895,
    zoom: 10,
  };

  // API Routeからデータ取得
  useEffect(() => {
    const fetchMyUser = async () => {
      try {
        const res = await fetch(`/api/users?email=${currentUserEmail}`);
        if (!res.ok) throw new Error('ユーザー情報取得失敗');
        const data = await res.json();
        setMyUser(data);
      } catch (err) {
        console.error('ユーザー情報の取得に失敗しました:', err);
      }
    };
    fetchMyUser();
  }, []);

  // 現在地を復元＋取得
  useEffect(() => {
    const saved = localStorage.getItem('myLocation');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMyLocation(parsed);
    }

    if (!navigator.geolocation) {
      console.warn('このブラウザは位置情報をサポートしていません。');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setMyLocation(newLoc);
        localStorage.setItem('myLocation', JSON.stringify(newLoc));

        // --- サーバーにPOST ---
        await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUserEmail,
            lat: latitude,
            lng: longitude,
            message: '現在地を更新しました。',
          }),
        });
      },
      (err) => console.error('位置情報の取得に失敗しました:', err)
    );
  }, []);

  // mapLoaded と myLocation が揃ったら flyTo
  useEffect(() => {
    if (mapLoaded && myLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [myLocation.lng, myLocation.lat],
        zoom: 13,
        speed: 1.2,
      });
    }
  }, [mapLoaded, myLocation]);

  // 他ユーザーの位置情報を取得
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/locations', { cache: 'no-store' });
      const data = await res.json();
      const others = data.filter(
        (loc: any) => loc.user?.email !== currentUserEmail
      );
      setLocations(others);
    };
    fetchData();
  }, []);

  // MarkerをuseMemoで生成
  const pins = useMemo(
    () =>
      locations.map((loc: any, i: number) => {
        const isSelected = popupInfo?.id === loc.id;
        return (
          <Marker
            key={`marker-${i}`}
            longitude={loc.lng}
            latitude={loc.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(isSelected ? null : loc);
            }}
          >
            <div className="flex flex-col items-center transform -translate-y-1.5">
              <img
                src={loc.user?.image ?? '/user-icons/default.png'}
                alt={loc.user?.name ?? 'User'}
                className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover cursor-pointer"
              />
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
        ref={mapRef}
        initialViewState={initialView}
        onLoad={() => setMapLoaded(true)}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        className="w-full h-full"
      >
        {pins}

        {/* 自分の現在地 */}
        {myLocation && myUser && (
          <Marker
            longitude={myLocation.lng}
            latitude={myLocation.lat}
            anchor="bottom"
          >
            <div className="flex flex-col items-center transform -translate-y-1.5">
              <img
                src={myUser.image ?? '/user-icons/default.png'}
                alt={myUser.name ?? 'You'}
                className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover cursor-pointer"
              />
              <span className="mt-1 bg-white text-gray-800 text-xs font-medium px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                {myUser.name ?? 'You'}
              </span>
            </div>
          </Marker>
        )}

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
