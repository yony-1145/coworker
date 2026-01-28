'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Map } from 'react-map-gl/maplibre';
import Pin from '@/components/Pin'; // Pin を共通化
import Popup from '@/components/Popup'; // Popup を共通化
import SpotFilters, { type CrowdLevel } from '@/components/spot/SpotFilters';

export default function MapPage() {
  const [spots, setSpots] = useState<any[]>([]);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const mapRef = useRef<any>(null);
  const [hasWifi, setHasWifi] = useState(false);
  const [hasPower, setHasPower] = useState(false);
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('ALL');

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

  // スポットの絞り込み
  const filteredSpots = useMemo(() => {
    return spots.filter((spot: any) => {
      if (hasWifi && !spot.hasWifi) return false;
      if (hasPower && !spot.hasPower) return false;
      if (crowdLevel !== 'ALL' && spot.crowdLevel !== crowdLevel) return false;
      return true;
    });
  }, [spots, hasWifi, hasPower, crowdLevel]);

  // --- スポットのピンのみ描画 ---
  const spotPins = useMemo(
    () =>
      filteredSpots.map((spot: any) => {
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
    [filteredSpots, popupInfo],
  );

  return (
    <>
      <div className="relative h-screen w-full">
        <div className="absolute left-4 top-4 z-10 rounded p-3">
          <SpotFilters
            hasWifi={hasWifi}
            hasPower={hasPower}
            crowdLevel={crowdLevel}
            onChangeHasWifi={setHasWifi}
            onChangeHasPower={setHasPower}
            onChangeCrowdLevel={setCrowdLevel}
          />
        </div>
        <Map
          ref={mapRef}
          initialViewState={initialView}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
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
      </div>
    </>
  );
}
