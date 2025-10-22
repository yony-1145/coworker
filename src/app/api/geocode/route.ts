import { NextResponse } from 'next/server';

// 住所 → 緯度経度 変換API
export async function POST(req: Request) {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: '住所が未入力です。' }, { status: 400 });
  }

  // OpenStreetMap Nominatim API
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'CoworkerApp/1.0 (contact@example.com)', // 識別ヘッダ（必須）
    },
  });

  const data = await res.json();

  if (!data.length) {
    return NextResponse.json(
      { error: '住所から位置を取得できませんでした。' },
      { status: 404 }
    );
  }

  const { lat, lon } = data[0];

  return NextResponse.json({
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
  });
}
