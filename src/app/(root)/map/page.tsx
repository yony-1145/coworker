'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Map } from 'react-map-gl/maplibre';
import UserPin from '@/components/UserPin';
import UserPopup from '@/components/UserPopup';
import SpotPin from '@/components/SpotPin';
import SpotPopup from '@/components/SpotPopup';
import { useMyLocation } from '@/hooks/useMyLocation';

export default function MapPage() {
  const [locations, setLocations] = useState([]); // 他ユーザーの位置
  const [spots, setSpots] = useState([]); // 投稿されたスポット
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const mapRef = useRef<any>(null);

  const currentUserEmail = 'yone@example.com';
  const { myLocation, setMapLoaded } = useMyLocation(mapRef, currentUserEmail);

  const initialView = {
    longitude: 139.6917,
    latitude: 35.6895,
    zoom: 10,
  };

  // --- 他ユーザーの位置を取得 ---
  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch('/api/locations', { cache: 'no-store' });
      const data = await res.json();
      const others = data.filter(
        (loc: any) => loc.user?.email !== currentUserEmail
      );
      setLocations(others);
    };
    fetchLocations();
  }, []);

  // --- スポット一覧を取得 ---
  useEffect(() => {
    const fetchSpots = async () => {
      const res = await fetch('/api/spots', { cache: 'no-store' });
      const data = await res.json();
      setSpots(data);
    };
    fetchSpots();
  }, []);

  // --- ユーザー用ピン ---
  const userPins = useMemo(
    () =>
      locations.map((loc: any, i: number) => {
        const isSelected =
          popupInfo?.id === loc.id && popupInfo?.type === 'user';
        return (
          <UserPin
            key={`user-${i}`}
            user={loc.user}
            lat={loc.lat}
            lng={loc.lng}
            showName={!isSelected}
            onClick={() =>
              setPopupInfo(isSelected ? null : { ...loc, type: 'user' })
            }
          />
        );
      }),
    [locations, popupInfo]
  );

  // --- スポット用ピン ---
  const spotPins = useMemo(
    () =>
      spots.map((spot: any, i: number) => {
        const isSelected =
          popupInfo?.id === spot.id && popupInfo?.type === 'spot';
        return (
          <SpotPin
            key={`spot-${i}`}
            spot={spot}
            onClick={() =>
              setPopupInfo(isSelected ? null : { ...spot, type: 'spot' })
            }
          />
        );
      }),
    [spots, popupInfo]
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
        {/* ユーザーのピン */}
        {userPins}

        {/* スポットのピン */}
        {spotPins}

        {/* 選択中ポップアップ */}
        {popupInfo?.type === 'user' && (
          <UserPopup
            user={popupInfo.user}
            lat={popupInfo.lat}
            lng={popupInfo.lng}
            message={popupInfo.message}
            onClose={() => setPopupInfo(null)}
          />
        )}
        {popupInfo?.type === 'spot' && (
          <SpotPopup spot={popupInfo} onClose={() => setPopupInfo(null)} />
        )}
      </Map>
    </main>
  );
}
