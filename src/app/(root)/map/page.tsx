'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Map, type MapRef } from 'react-map-gl/maplibre';
import Pin from '@/components/Pin';
import Popup from '@/components/Popup';
import LoadingOverlay from '@/components/LoadingOverlay';
import SpotFilters, { type CrowdLevel } from '@/components/spot/SpotFilters';

type MapSpot = {
  id: string;
  title?: string | null;
  description?: string | null;
  latitude: number;
  longitude: number;
  genre?: 'CAFE' | 'COWORKING' | 'OTHER' | null;
  imageUrls?: string[] | null;
  hasWifi?: boolean;
  hasPower?: boolean;
  hasQuietSpace?: boolean;
  hasLargeTable?: boolean;
  hasPhoneCallOK?: boolean;
  hasMeetingSpace?: boolean;
  crowdLevel?: CrowdLevel;
};

/**
 * 地図ページ
 * - 地図上でのスポット探索を一画面で完結させる
 * - 絞り込みと詳細確認を同じ体験内にまとめる
 */
export default function MapPage() {
  const [spots, setSpots] = useState<MapSpot[]>([]);
  const [popupInfo, setPopupInfo] = useState<(MapSpot & { type: 'spot' }) | null>(
    null,
  );
  const mapRef = useRef<MapRef | null>(null);
  const [hasWifi, setHasWifi] = useState(false);
  const [hasPower, setHasPower] = useState(false);
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      setIsLoading(true);
      setLoadError(null);
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
          const msg =
            typeof body?.message === 'string' && body.message.trim()
              ? body.message
              : 'スポットの読み込みに失敗しました。';
          setLoadError(msg);
        } else {
          setLoadError('スポットの読み込みに失敗しました。');
        }
      } catch (err) {
        console.error('[Map] Failed to fetch spots:', err);
        setSpots([]);
        setLoadError('スポットの読み込みに失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpots();
  }, []);

  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      if (hasWifi && !spot.hasWifi) return false;
      if (hasPower && !spot.hasPower) return false;
      if (crowdLevel !== 'ALL' && spot.crowdLevel !== crowdLevel) return false;
      return true;
    });
  }, [spots, hasWifi, hasPower, crowdLevel]);

  const spotPins = useMemo(
    () =>
      filteredSpots.map((spot) => {
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
      <div className="relative h-screen w-[calc(100%+3rem)] -m-6">
        <div className="absolute left-4 top-4 z-20 md:hidden">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-md border border-gray-200"
          >
            {isFilterOpen ? 'フィルターを閉じる' : 'フィルター'}
          </button>
        </div>
        <div
          className={`absolute left-4 right-4 top-16 z-20 rounded-lg bg-white/95 p-3 shadow-md md:right-auto md:top-4 md:bg-transparent md:p-0 md:shadow-none ${
            isFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
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
              item={popupInfo}
              lat={popupInfo.latitude}
              lng={popupInfo.longitude}
              message={popupInfo.description ?? undefined}
              onClose={() => setPopupInfo(null)}
            />
          )}
        </Map>
        {isLoading && <LoadingOverlay />}
        {!isLoading && loadError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <div className="rounded-md bg-white px-4 py-2 text-sm text-red-600 shadow">
              {loadError}
            </div>
          </div>
        )}
        {!isLoading && !loadError && filteredSpots.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <div className="rounded-md bg-white px-4 py-2 text-sm text-gray-700 shadow">
              フィルター条件に一致するスポットがありません
            </div>
          </div>
        )}
      </div>
    </>
  );
}
