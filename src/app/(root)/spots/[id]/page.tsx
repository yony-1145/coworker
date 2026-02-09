import { headers } from 'next/headers';
import SpotDetail from '@/components/SpotDetail';

type SpotPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * スポット詳細ページ
 * - 指定IDのスポットを取得し詳細コンポーネントで表示
 * - 取得失敗・不正なレスポンス時はエラー表示
 */
export default async function SpotPage({ params }: SpotPageProps) {
  const { id } = await params;

  const envUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL;
  const vercelUrl = process.env.VERCEL_URL;
  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
  const proto = headerList.get('x-forwarded-proto') ?? 'https';
  const baseUrl =
    envUrl ||
    (vercelUrl ? `https://${vercelUrl}` : '') ||
    (host ? `${proto}://${host}` : 'http://localhost:3000');

  const res = await fetch(`${baseUrl}/api/spots/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch spot:', res.status, res.statusText);
    return (
      <div className="max-w-2xl mx-auto p-4 text-center text-gray-600">
        スポット情報を取得できませんでした。
      </div>
    );
  }

  const body = await res.json();
  const spot = body?.data?.spot;

  if (body?.status !== 'success' || !spot) {
    console.error('Invalid response shape:', body);
    return (
      <div className="max-w-2xl mx-auto p-4 text-center text-gray-600">
        スポット情報を取得できませんでした。
      </div>
    );
  }

  return <SpotDetail spot={spot} />;
}
