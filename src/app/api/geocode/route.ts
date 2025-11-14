import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { address } = await req.json();
    console.log('API received address:', address);

    if (!address || !address.trim()) {
      return NextResponse.json({ results: [], error: '住所が未入力です。' });
    }

    const apiKey = process.env.OPENCAGE_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENCAGE_API_KEY in env');
      return NextResponse.json({
        results: [],
        error: 'サーバー設定の問題が発生しました。',
      });
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address.trim()
    )}&key=${apiKey}&limit=5&language=ja`;

    console.log('Fetching OpenCage URL:', url);

    let ocRes: Response;
    try {
      ocRes = await fetch(url);
    } catch (err) {
      console.error('OpenCage fetch failed:', err);
      return NextResponse.json({
        results: [],
        error: '外部API接続に失敗しました。',
      });
    }

    const rawText = await ocRes.text();
    console.log('Raw response (first 200 chars):', rawText.slice(0, 200));

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error('OpenCage JSON parse error:', err);
      return NextResponse.json({
        results: [],
        error: '検索結果が見つかりません。',
      });
    }

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({
        results: [],
        error: '検索結果が見つかりません。',
      });
    }

    const results = data.results.map((r: any) => ({
      name: r.formatted,
      latitude: r.geometry.lat,
      longitude: r.geometry.lng,
    }));

    console.log('Final results:', results);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json({
      results: [],
      error: '検索処理に失敗しました。',
    });
  }
}
