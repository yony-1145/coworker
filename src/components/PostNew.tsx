'use client';

import { useState, useRef, useEffect } from 'react';
import { Map, Marker, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useRouter } from 'next/navigation';

/**
 * スポット投稿 Step1：住所検索で位置を決め、詳細入力へ進む
 * - ジオコーディングで候補取得・選択後、Step2 へ遷移
 */
export default function PostNew() {
  const router = useRouter();
  const mapRef = useRef<MapRef | null>(null);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<
    { name: string; latitude: number; longitude: number }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchReturnedEmpty, setSearchReturnedEmpty] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Nominatim（OSM）で住所・店名から緯度経度を取得
  const handleGeocode = async () => {
    if (!address.trim() || isSearching) return;
    setIsSearching(true);
    setCandidates([]);
    setSearchReturnedEmpty(false);
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!res.ok) {
        console.error('Geocode API HTTP error:', res.status);
        setCandidates([]);
        setSearchReturnedEmpty(false);
        return;
      }

      let body: {
        status?: string;
        data?: { results?: unknown[] };
        message?: string;
      };
      try {
        body = await res.json();
      } catch (err) {
        console.error('Failed to parse API JSON:', err);
        setCandidates([]);
        return;
      }

      if (body?.status === 'error') {
        console.warn('Geocode API returned error:', body?.message);
        setCandidates([]);
        setSearchReturnedEmpty(false);
        return;
      }

      // 候補を設定
      const results = Array.isArray(body?.data?.results)
        ? body.data.results
        : [];
      setCandidates(
        results as { name: string; latitude: number; longitude: number }[],
      );
      setSearchReturnedEmpty(results.length === 0);
    } catch (error) {
      console.error('Geocode fetch failed:', error);
      setCandidates([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectCandidate = (lat: number, lon: number, name: string) => {
    setCoords({ latitude: lat, longitude: lon });
    setAddress(name);
    setCandidates([]);
    setSearchReturnedEmpty(false);
    setFormError(null);
  };

  // ピンが設置されたら地図をその位置に寄せてズーム（検索候補選択・地図クリックどちらも）
  useEffect(() => {
    if (!coords) return;
    mapRef.current?.flyTo({
      center: [coords.longitude, coords.latitude],
      zoom: 17,
      duration: 800,
    });
  }, [coords]);

  // 緯度経度・住所を渡して、Step2 へ遷移へ遷移 ---
  const handleNext = async () => {
    if (!coords) {
      setFormError(
        '住所検索または地図をクリックして、スポットの位置を選択してください。',
      );
      return;
    }
    setFormError(null);
    setIsCheckingDuplicate(true);
    try {
      const params = new URLSearchParams({
        lat: coords.latitude.toString(),
        lon: coords.longitude.toString(),
      });
      if (address.trim()) {
        params.set('title', address.trim());
      }

      const res = await fetch(`/api/spots/exists?${params.toString()}`);
      const body = await res.json().catch(() => null);

      if (!res.ok || body?.status === 'error') {
        setFormError(body?.message ?? '重複チェックに失敗しました');
        return;
      }

      if (body?.data?.exists) {
        setFormError('既にに登録されているスポットです。');
        return;
      }

      router.push(
        `/posts/new/details?lat=${coords.latitude}&lon=${coords.longitude}&address=${encodeURIComponent(address)}`,
      );
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 space-y-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Step 1 / 2：場所を決定
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          住所検索または地図をクリックして、スポットの位置を選択してください。
        </p>
        {/* 住所 */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            住所または地名
          </label>

          <div className="flex space-x-2">
            <input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setSearchReturnedEmpty(false);
                setFormError(null);
              }}
              placeholder="博多駅 スターバックス"
              className="flex-1 border rounded-lg px-3 py-2"
              disabled={isSearching}
            />
            <button
              type="button"
              onClick={handleGeocode}
              disabled={isSearching || !address.trim()}
              className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isSearching ? '検索中...' : '検索'}
            </button>
          </div>

          {searchReturnedEmpty && !isSearching && (
            <p className="mt-2 text-sm text-red-600">
              検索結果がありません。地図上をクリックして位置を選択してください。
            </p>
          )}

          <p className="mt-3 text-xs text-gray-500">
            複数の語句はスペースやカンマで区切ると検索が効率化されます。
          </p>

          {isSearching && (
            <div className="flex items-center gap-2 py-2 text-sm text-blue-600">
              <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              位置を検索しています…
            </div>
          )}

          {candidates.length > 0 && !isSearching && (
            <ul className="mt-2 border rounded-md divide-y">
              {candidates.map((c, i) => (
                <li
                  key={i}
                  onClick={() =>
                    selectCandidate(c.latitude, c.longitude, c.name)
                  }
                  className="p-2 text-sm hover:bg-blue-50 cursor-pointer"
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 地図プレビュー */}
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: 135.5,
              latitude: 34.7,
              zoom: 5,
            }}
            style={{ width: '100%', height: 250 }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            onClick={(e: MapLayerMouseEvent) => {
              setCoords({
                latitude: e.lngLat.lat,
                longitude: e.lngLat.lng,
              });
              setSearchReturnedEmpty(false);
              setFormError(null);
            }}
          >
            {coords && (
              <Marker
                longitude={coords.longitude}
                latitude={coords.latitude}
                color="red"
              />
            )}
          </Map>
        </div>

        <button
          onClick={handleNext}
          disabled={isCheckingDuplicate}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
        >
          {isCheckingDuplicate ? '重複確認中...' : '次へ'}
        </button>
        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}
      </div>
    </main>
  );
}
