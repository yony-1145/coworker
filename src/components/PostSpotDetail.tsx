'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * SpotDetailsPage
 * Step2：選択した位置情報にもとづき、スポット情報を入力して登録する画面
 */
export default function SpotDetailsPage() {
  const router = useRouter();
  const params = useSearchParams();

  /** Step1 から受け取った位置情報と住所 */
  const latitude = parseFloat(params.get('lat') || '0');
  const longitude = parseFloat(params.get('lon') || '0');
  const address = params.get('address') || '';

  /** 入力値 */
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<'CAFE' | 'COWORKING' | 'OTHER'>('CAFE');
  const [hasWifi, setHasWifi] = useState(false);
  const [hasPower, setHasPower] = useState(false);
  const [hasQuietSpace, setHasQuietSpace] = useState(false);
  const [hasLargeTable, setHasLargeTable] = useState(false);
  const [hasPhoneCallOK, setHasPhoneCallOK] = useState(false);
  const [hasMeetingSpace, setHasMeetingSpace] = useState(false);
  const [crowdLevel, setCrowdLevel] = useState<'LOW' | 'MID' | 'HIGH'>('MID');
  const [openingHours, setOpeningHours] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * 画像プレビュー用の一時URLを管理する（選び直し/離脱時に破棄）
   * - File はそのまま <img> に渡せないため createObjectURL でURL化する
   * - 不要になったURLは revokeObjectURL で破棄してメモリリークを防ぐ
   */
  useEffect(() => {
    if (imageFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  /**
   * 画像選択（複数対応）
   * - この時点ではStorageへアップロードしない（保存時にまとめて行う）
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    // input要素のvalueをリセット（同じファイルを再度選択できるようにする）
    e.target.value = '';
  };

  /**
   * 画像を削除
   */
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 入力されたスポット情報を API に送信して登録
   * - 保存時に /api/uploads へ画像を送信 → URL取得 → /api/spots にURLを送る
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('スポット名を入力してください');
      return;
    }

    // 営業時間の最大文字数チェック
    if (openingHours && openingHours.length > 100) {
      setErrorMessage('営業時間は100文字以内で入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      /** 保存時に画像アップロード（複数対応） */
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'spot');

          const uploadRes = await fetch('/api/uploads', {
            method: 'POST',
            body: formData,
          });

          const uploadBody = await uploadRes.json().catch(() => null);

          if (!uploadRes.ok || uploadBody?.status === 'error') {
            const msg =
              uploadBody?.message ?? '画像のアップロードに失敗しました';
            setErrorMessage(msg);
            setIsSubmitting(false);
            return;
          }

          if (uploadBody?.data?.url) {
            imageUrls.push(uploadBody.data.url);
          }
        }
      }

      /** API 送信 */
      const res = await fetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          latitude,
          longitude,
          ...(address ? { address: address.trim() } : {}),
          ...(openingHours.trim() ? { openingHours: openingHours.trim() } : {}),
          genre,
          hasWifi,
          hasPower,
          hasQuietSpace,
          hasLargeTable,
          hasPhoneCallOK,
          hasMeetingSpace,
          crowdLevel,
          ...(imageUrls.length > 0 ? { imageUrls } : {}),
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok || body?.status === 'error') {
        if (res.status === 409) {
          setErrorMessage('近い場所に既に登録があります');
        } else if (res.status === 401) {
          setErrorMessage('ログインしてください');
        } else {
          setErrorMessage(body?.message ?? '投稿に失敗しました');
        }
        setIsSubmitting(false);
        return;
      }

      const spot = body?.data?.spot;
      if (spot?.latitude && spot?.longitude) {
        router.push(`/map?lat=${spot.latitude}&lng=${spot.longitude}`);
      } else {
        // フォールバック: 投稿時に使用した座標を使用
        router.push(`/map?lat=${latitude}&lng=${longitude}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('投稿に失敗しました');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            スポット情報を入力
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Step 2 / 2</p>
        </div>

        {/* 住所表示（フォーム外、テキスト表示専用） */}
        {address && (
          <div className="pb-1">
            <p className="text-xs font-medium text-gray-400 mb-0.5">登録場所</p>
            <p className="text-sm text-gray-700">{address}</p>
          </div>
        )}

        {/* スポット名（フル幅、下線スタイル） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            スポット名 <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="スターバックス 博多駅店"
            className="w-full bg-transparent border-0 border-b border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-900 py-2 transition-colors"
            required
          />
        </div>

        {/* ジャンル + 混雑度（2カラム、面スタイル） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ジャンル
            </label>
            <select
              value={genre}
              onChange={(e) =>
                setGenre(e.target.value as 'CAFE' | 'COWORKING' | 'OTHER')
              }
              className="w-full bg-gray-50 rounded-lg px-3 py-2 focus:outline-none focus:bg-gray-100 transition-colors"
            >
              <option value="CAFE">カフェ</option>
              <option value="COWORKING">コワーキングスペース</option>
              <option value="OTHER">その他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              混雑度
            </label>
            <select
              value={crowdLevel}
              onChange={(e) =>
                setCrowdLevel(e.target.value as 'LOW' | 'MID' | 'HIGH')
              }
              className="w-full bg-gray-50 rounded-lg px-3 py-2 focus:outline-none focus:bg-gray-100 transition-colors"
            >
              <option value="LOW">空いている</option>
              <option value="MID">普通</option>
              <option value="HIGH">混雑している</option>
            </select>
          </div>
        </div>

        {/* 営業時間（フル幅、下線スタイル） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            営業時間{' '}
            <span className="text-xs text-gray-400 font-normal">（任意）</span>
          </label>
          <input
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            placeholder="9:00-18:00 / 平日 10:00-19:00"
            maxLength={100}
            className="w-full bg-transparent border-0 border-b border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-900 py-2 transition-colors"
          />
        </div>

        {/* 設備（チップUI、横並び＋折り返し） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            設備
          </label>
          <div className="flex flex-wrap gap-2">
            <label
              className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
                hasWifi
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={hasWifi}
                onChange={(e) => setHasWifi(e.target.checked)}
                className="sr-only"
              />
              Wi-Fiあり
            </label>
            <label
              className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
                hasPower
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={hasPower}
                onChange={(e) => setHasPower(e.target.checked)}
                className="sr-only"
              />
              電源あり
            </label>
            <label
              className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
                hasQuietSpace
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={hasQuietSpace}
                onChange={(e) => setHasQuietSpace(e.target.checked)}
                className="sr-only"
              />
              静かな空間
            </label>
            <label
              className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
                hasLargeTable
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={hasLargeTable}
                onChange={(e) => setHasLargeTable(e.target.checked)}
                className="sr-only"
              />
              広いテーブル
            </label>
            <label
              className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
                hasPhoneCallOK
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={hasPhoneCallOK}
                onChange={(e) => setHasPhoneCallOK(e.target.checked)}
                className="sr-only"
              />
              通話OK
            </label>
            <label
              className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
                hasMeetingSpace
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={hasMeetingSpace}
                onChange={(e) => setHasMeetingSpace(e.target.checked)}
                className="sr-only"
              />
              ミーティング可
            </label>
          </div>
        </div>

        {/* 画像アップロード（独立セクション、余白を取る） */}
        <div className="pt-4">
          <h2 className="text-base font-semibold text-gray-900 mb-2">画像</h2>
          <label className="block cursor-pointer">
            <div className="w-full min-h-[160px] border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden hover:border-gray-300 hover:bg-gray-50 transition-all p-6">
              {previewUrls.length > 0 ? (
                <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">
                    クリックして画像を選択
                  </p>
                  <p className="text-xs text-gray-400">複数選択可</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* エラー表示 */}
        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        {/* 送信ボタン */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
      </div>
    </main>
  );
}
