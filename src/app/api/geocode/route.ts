import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { address } = await req.json();
  if (!address) {
    return NextResponse.json({ error: '住所が未入力です。' }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'CoworkerApp/1.0 (contact@example.com)', // 必須（識別用）
    },
  });

  const data = await res.json();
  if (!data.length) {
    return NextResponse.json(
      { error: '住所から位置を取得できません。' },
      { status: 404 }
    );
  }

  // 複数候補を返却
  const results = data.map((item: any) => ({
    name: item.display_name,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
  }));

  return NextResponse.json({ results });
}
