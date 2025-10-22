'use client';

import { useState, useRef } from 'react';
import { Map, Marker } from 'react-map-gl/maplibre';

export default function PostPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<any>(null);

  // --- geocode API呼び出し ---
  const geocodeAddress = async (address: string) => {
    const res = await fetch('/api/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    if (!res.ok) return null;
    return await res.json();
  };

  // --- 住所検索ボタン ---
  const handleGeocode = async () => {
    if (!address) return;
    const result = await geocodeAddress(address);
    if (result) {
      setCoords(result);
      mapRef.current?.flyTo({
        center: [result.longitude, result.latitude],
        zoom: 14,
        duration: 1500,
      });
    } else {
      alert('住所から位置を取得できませんでした。');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- 投稿処理 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords) {
      alert('位置が確定していません。住所を検索して確認してください。');
      return;
    }

    setIsSubmitting(true);

    // 画像をBase64に変換（仮）
    let imageBase64: string | null = null;
    if (image) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
      });
      reader.readAsDataURL(image);
      imageBase64 = await base64Promise;
    }

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const res = await fetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '37c18ff7-c0c5-42a0-8925-fa2ae95e1f9a',
        title,
        description,
        latitude: coords.latitude,
        longitude: coords.longitude,
        image: imageBase64,
        tags: tagList,
      }),
    });

    setIsSubmitting(false);

    if (res.ok) {
      alert('スポットを登録しました！');
      setTitle('');
      setDescription('');
      setAddress('');
      setTags('');
      setImage(null);
      setPreview(null);
      setCoords(null);
    } else {
      alert('登録に失敗しました。');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          新しいスポットを投稿
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：スターバックス博多"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Wi-Fi・電源あり / 落ち着いた雰囲気"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* 住所 + 検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住所
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="例：福岡市博多区博多駅前2丁目"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleGeocode}
                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
              >
                検索
              </button>
            </div>
          </div>

          {/* ミニマップ */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
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
                setCoords({
                  latitude: e.lngLat.lat,
                  longitude: e.lngLat.lng,
                })
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

          {/* タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タグ（カンマ区切り）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例：カフェ, Wi-Fi, 電源"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* 画像 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <div className="w-full border border-dashed border-gray-400 rounded-lg px-3 py-8 text-center hover:bg-gray-50 transition">
                  {image ? (
                    <p className="text-sm text-gray-600">{image.name}</p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      クリックして画像を選択
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-16 h-16 rounded-md object-cover border"
                />
              )}
            </div>
          </div>

          {/* 投稿ボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </button>
        </form>
      </div>
    </main>
  );
}
