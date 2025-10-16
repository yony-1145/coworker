'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Map, Marker, Popup } from 'react-map-gl/maplibre';
import UserPin from '@/components/UserPin';
import UserPopup from '@/components/UserPopup';
import { useMyLocation } from '@/hooks/useMylocations';

export default function HomePage() {
  const [locations, setLocations] = useState([]);
  const [myUser, setMyUser] = useState<any | null>(null);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const mapRef = useRef<any>(null);

  const currentUserEmail = 'yone@example.com';

  const { myLocation, setMapLoaded } = useMyLocation(mapRef, currentUserEmail); // ✅ 追加

  const initialView = {
    longitude: 139.6917,
    latitude: 35.6895,
    zoom: 10,
  };

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
          <UserPin
            key={i}
            user={loc.user}
            lat={loc.lat}
            lng={loc.lng}
            showName={!isSelected}
            onClick={() => setPopupInfo(isSelected ? null : loc)}
          />
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
          <UserPin user={myUser} lat={myLocation.lat} lng={myLocation.lng} />
        )}

        {popupInfo && (
          <UserPopup
            user={popupInfo.user}
            lat={popupInfo.lat}
            lng={popupInfo.lng}
            message={popupInfo.message}
            onClose={() => setPopupInfo(null)}
          />
        )}
      </Map>
    </main>
  );
}
