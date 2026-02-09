import Link from 'next/link';

const features = [
  {
    title: '条件でスポットを探す',
    description:
      'Wi-Fiや電源、混雑度などの条件で、作業しやすい場所を見つけられます。',
  },
  {
    title: 'スポットを投稿する',
    description: 'お気に入りの場所を登録して、コミュニティに共有できます。',
  },
  {
    title: 'ユーザーを見つける',
    description: '他のユーザーの投稿やプロフィールを確認できます。',
  },
];

const steps = [
  {
    title: '地図で探す',
    description: 'フィルターで条件に合う場所を探します。',
  },
  { title: '詳細を見る', description: '設備や説明を確認して選びます。' },
  {
    title: 'スポットを投稿',
    description: 'おすすめの場所を登録して共有します。',
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-5xl mx-auto space-y-16">
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="/coworker.jpg"
                  alt="Coworker"
                  className="h-8 w-8 rounded-md object-cover"
                />
                <p className="text-3xl font-semibold text-gray-900">Coworker</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
                作業に最適な場所を、
                <br />
                もっと簡単に見つけよう
              </h1>
              <p className="text-gray-600 text-base leading-relaxed">
                カフェやコワーキングを探して、共有して、また訪れる。
                Coworkerは「作業場所」を見つけるための地図アプリです。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/map"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-5 py-2 text-sm font-medium hover:bg-indigo-700 transition"
                >
                  はじめる
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 px-5 py-2 text-sm font-medium hover:bg-gray-50 transition"
                >
                  ログイン
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 h-64 md:h-72 flex items-center justify-center text-gray-400 text-sm">
              ここにアプリ画面の画像
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              3つのコア機能
            </h2>
            <p className="text-sm text-gray-500">
              作業場所の発見から共有までをシンプルに。
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white/90 border border-gray-100 shadow-sm p-6 space-y-3"
              >
                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                使い方はシンプル
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                地図で探して、気になる場所を確認、投稿して共有できます。
              </p>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3 border border-gray-200"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 h-64 md:h-72 flex items-center justify-center text-gray-400 text-sm">
              ここに機能説明の画像
            </div>
          </div>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            さっそく始めよう
          </h2>
          <p className="text-sm text-gray-600">まずは地図から作業場所を検索</p>
          <Link
            href="/map"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 text-white px-6 py-2 text-sm font-medium hover:bg-indigo-700 transition"
          >
            マップを見る
          </Link>
        </section>
      </div>
    </main>
  );
}
