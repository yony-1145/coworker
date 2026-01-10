'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Map } from 'react-map-gl/maplibre';
import Pin from '@/components/Pin'; // Pin を共通化
import Popup from '@/components/Popup'; // Popup を共通化
import { useMyLocation } from '@/hooks/useMyLocation';

export default function MapPage() {
  const [locations, setLocations] = useState([]); // 他ユーザーの位置
  const [spots, setSpots] = useState([]); // 投稿されたスポット
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const mapRef = useRef<any>(null);

  const currentUserEmail = 'yone@example.com';
  const { myLocation, setMapLoaded } = useMyLocation(mapRef, currentUserEmail); // 位置情報を取得

  const initialView = {
    longitude: 130.6917,
    latitude: 33.6917,
    zoom: 10,
  };

  // // --- 他ユーザーの位置を取得 ---
  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     const res = await fetch('/api/locations', { cache: 'no-store' });
  //     const data = await res.json();
  //     const others = data.spots.filter(
  //       (loc: any) => loc.user?.email !== currentUserEmail
  //     );
  //     setLocations(others);
  //   };
  //   fetchLocations();
  // }, []);

  // --- スポット一覧を取得 ---
  useEffect(() => {
    const fetchSpots = async () => {
      const res = await fetch('/api/spots', { cache: 'no-store' });
      const data = await res.json();
      // APIレスポンスは { ok: true, spots: [...] } なので、配列だけを state に入れる
      setSpots(Array.isArray(data?.spots) ? data.spots : []);
    };
    fetchSpots();
  }, []);

  // --- ユーザーとスポットのピンを描画 ---
  const pins = useMemo(() => {
    const userPins = locations.map((loc: any) => {
      const isSelected = popupInfo?.id === loc.id && popupInfo?.type === 'user';
      return (
        <Pin
          key={`user-${loc.id}`}
          type="user" // 共通Pinにtypeを指定
          item={loc.user}
          lat={loc.lat}
          lng={loc.lng}
          showName={!isSelected}
          onClick={() =>
            setPopupInfo(isSelected ? null : { ...loc, type: 'user' })
          }
        />
      );
    });

    const spotPins = spots.map((spot: any) => {
      const isSelected =
        popupInfo?.id === spot.id && popupInfo?.type === 'spot';
      return (
        <Pin
          key={`spot-${spot.id}`}
          type="spot" // Spot用Pin
          item={spot}
          lat={spot.latitude}
          lng={spot.longitude}
          showName={!isSelected}
          onClick={() =>
            setPopupInfo(isSelected ? null : { ...spot, type: 'spot' })
          }
        />
      );
    });

    return [...userPins, ...spotPins];
  }, [locations, spots, popupInfo]);

  // --- スポット用ピン ---
  const spotPins = useMemo(
    () =>
      spots.map((spot: any, i: number) => {
        const isSelected =
          popupInfo?.id === spot.id && popupInfo?.type === 'spot';
        return (
          <Pin
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
    <>
      <Map
        ref={mapRef}
        initialViewState={initialView}
        onLoad={() => setMapLoaded(true)}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {/* すべてのピンをまとめて描画 */}
        {pins}

        {/* Popupに統一 */}
        {popupInfo && (
          <Popup
            type={popupInfo.type}
            item={popupInfo.type === 'user' ? popupInfo.user : popupInfo}
            lat={popupInfo.lat ?? popupInfo.latitude}
            lng={popupInfo.lng ?? popupInfo.longitude}
            message={popupInfo.message ?? popupInfo.description}
            onClose={() => setPopupInfo(null)}
          />
        )}
        {popupInfo?.type === 'spot' && (
          <Popup spot={popupInfo} onClose={() => setPopupInfo(null)} />
        )}
      </Map>
    </>
  );
}
