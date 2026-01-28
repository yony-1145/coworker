'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Map } from 'react-map-gl/maplibre';
import Pin from '@/components/Pin'; // Pin を共通化
import Popup from '@/components/Popup'; // Popup を共通化

export default function MapPage() {
  const [spots, setSpots] = useState<any[]>([]);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const mapRef = useRef<any>(null);

  const initialView = {
    longitude: 130.6917,
    latitude: 33.6917,
    zoom: 10,
  };

  // --- スポット一覧を取得 ---
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch('/api/spots');
        const data = await res.json();
        if (data?.ok && Array.isArray(data.spots)) {
          setSpots(data.spots);
        } else if (!res.ok) {
          console.error(
            '[Map] Failed to fetch spots:',
            res.status,
            data?.error?.message ?? res.statusText,
          );
        }
      } catch (err) {
        console.error('[Map] Failed to fetch spots:', err);
        setSpots([]);
      }
    };
    fetchSpots();
  }, []);

  // --- スポットのピンのみ描画 ---
  const spotPins = useMemo(
    () =>
      spots.map((spot: any) => {
        const isSelected =
          popupInfo?.id === spot.id && popupInfo?.type === 'spot';
        return (
          <Pin
            key={`spot-${spot.id}`}
            type="spot"
            item={spot}
            lat={spot.latitude}
            lng={spot.longitude}
            showName={!isSelected}
            onClick={() =>
              setPopupInfo(isSelected ? null : { ...spot, type: 'spot' })
            }
          />
        );
      }),
    [spots, popupInfo],
  );

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={initialView}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {/* スポットのピンのみ描画 */}
        {spotPins}

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
      </Map>
    </>
  );
}
