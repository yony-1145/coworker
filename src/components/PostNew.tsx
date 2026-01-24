'use client';

import { useState, useRef } from 'react';
import { Map, Marker } from 'react-map-gl/maplibre';
import { useRouter } from 'next/navigation';

export default function PostNew() {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [candidates, setCandidates] = useState<
    { name: string; latitude: number; longitude: number }[]
  >([]);

  // --- geocode API ---
  const handleGeocode = async () => {
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      // HTTP エラー（400/500）
      if (!res.ok) {
        console.error('Geocode API HTTP error:', res.status);
        setCandidates([]);
        return;
      }

      let data: any;

      // JSON パース安全化
      try {
        data = await res.json();
      } catch (err) {
        console.error('Failed to parse API JSON:', err);
        setCandidates([]);
        return;
      }

      // API の error フィールドがある場合（住所ゼロ or 外部API不調）
      if (data.error) {
        console.warn('Geocode API returned error:', data.error);
        setCandidates([]);
        return;
      }

      // 正常パス
      const results = Array.isArray(data.results) ? data.results : [];
      setCandidates(results);
    } catch (error) {
      // fetch がそもそも失敗
      console.error('Geocode fetch failed:', error);
      setCandidates([]);
    }
  };

  // --- 候補選択 ---
  const selectCandidate = (lat: number, lon: number, name: string) => {
    setCoords({ latitude: lat, longitude: lon });
    setAddress(name);
    setCandidates([]);
    mapRef.current?.flyTo({ center: [lon, lat], zoom: 14, duration: 1200 });
  };

  // --- 詳細登録へ遷移 ---
  const handleNext = () => {
    if (!coords) {
      alert('住所を入力してください');
      return;
    }
    router.push(
      `/posts/new/details?lat=${coords.latitude}&lon=${coords.longitude}&address=${encodeURIComponent(address)}`,
    );
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
              onChange={(e) => setAddress(e.target.value)}
              placeholder="例：博多駅 スターバックス"
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <button
              type="button"
              onClick={handleGeocode}
              className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
            >
              検索
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            地名と店舗名はスペースで区切ると検索精度が上がります。
          </p>

          {candidates.length > 0 && (
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
            onClick={(e) =>
              setCoords({ latitude: e.lngLat.lat, longitude: e.lngLat.lng })
            }
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
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
        >
          次へ
        </button>
      </div>
    </main>
  );
}
