'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Map } from 'react-map-gl/maplibre';
import Pin from '@/components/Pin';
import Popup from '@/components/Popup';
import SpotFilters, { type CrowdLevel } from '@/components/spot/SpotFilters';

/**
 * 地図ページ
 * - 地図上でのスポット探索を一画面で完結させる
 * - 絞り込みと詳細確認を同じ体験内にまとめる
 */
export default function MapPage() {
  const [spots, setSpots] = useState<any[]>([]);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const mapRef = useRef<any>(null);
  const [hasWifi, setHasWifi] = useState(false);
  const [hasPower, setHasPower] = useState(false);
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('ALL');

  const initialView = {
    longitude: 130.4208,
    latitude: 33.5904,
    zoom: 13,
  };

  useEffect(() => {
    /**
     * スポット一覧を取得し state にセット
     * - ApiResponse（status / data.spots）で判定
     */
    const fetchSpots = async () => {
      try {
        const res = await fetch('/api/spots');
        const body = await res.json().catch(() => null);
        if (body?.status === 'success' && Array.isArray(body?.data?.spots)) {
          setSpots(body.data.spots);
        } else if (body?.status === 'error' || !res.ok) {
          console.error(
            '[Map] Failed to fetch spots:',
            res.status,
            body?.message ?? res.statusText,
          );
        }
      } catch (err) {
        console.error('[Map] Failed to fetch spots:', err);
        setSpots([]);
      }
    };
    fetchSpots();
  }, []);

  const filteredSpots = useMemo(() => {
    return spots.filter((spot: any) => {
      if (hasWifi && !spot.hasWifi) return false;
      if (hasPower && !spot.hasPower) return false;
      if (crowdLevel !== 'ALL' && spot.crowdLevel !== crowdLevel) return false;
      return true;
    });
  }, [spots, hasWifi, hasPower, crowdLevel]);

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
          {spotPins}
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
