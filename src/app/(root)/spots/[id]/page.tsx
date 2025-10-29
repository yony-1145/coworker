import SpotDetail from '@/components/SpotDetail';

type SpotPageProps = {
  params: { id: string };
};

export default async function SpotPage({ params }: SpotPageProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/spots/${params.id}`,
    {
      cache: 'no-store', // 常に最新データを取得
    }
  );

  if (!res.ok) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center text-gray-600">
        スポット情報を取得できませんでした。
      </div>
    );
  }

  const spot = await res.json();

  return <SpotDetail spot={spot} />;
}
