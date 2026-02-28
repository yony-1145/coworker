import Link from 'next/link';
import Image from 'next/image';

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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto space-y-16">
        <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/coworker.jpg"
                  alt="Coworker"
                  className="h-8 w-8 rounded-md object-cover"
                />
                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Coworker</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                作業に最適な場所を、
                <br />
                もっと簡単に見つけよう
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
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
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-5 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  ログイン
                </Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-sm flex items-center justify-center min-h-64 max-h-96">
              <Image
                src="/welcome/map.png"
                alt="地図でスポットを探す画面"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              3つのコア機能
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              作業場所の発見から共有までをシンプルに。
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-3"
              >
                <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                使い方はシンプル
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                地図で探して、気になる場所を確認、投稿して共有できます。
              </p>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm items-start">
              <Image
                src="/welcome/profile.png"
                alt="プロフィール"
                className="w-full h-auto object-contain max-h-72"
                width={400}
                height={533}
                sizes="(max-width: 768px) 50vw, 320px"
              />
              <Image
                src="/welcome/spot.png"
                alt="スポット"
                className="w-full h-auto object-contain max-h-72"
                width={400}
                height={533}
                sizes="(max-width: 768px) 50vw, 320px"
              />
            </div>
          </div>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            さっそく始めよう
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">まずは地図から作業場所を検索</p>
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
