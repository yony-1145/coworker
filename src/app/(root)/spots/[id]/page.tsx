import SpotDetail from '@/components/SpotDetail';

type SpotPageProps = {
  params: { id: string };
};

/**
 * スポット詳細ページ
 * - 指定IDのスポットを取得し詳細コンポーネントで表示
 * - 取得失敗・不正なレスポンス時はエラー表示
 */
export default async function SpotPage({ params }: SpotPageProps) {
  const { id } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
