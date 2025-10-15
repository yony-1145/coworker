import { prisma } from '../src/lib/prisma';

// 新宿周辺の緯度経度を基準に、±0.01度の範囲でランダム生成
const randomLat = () => 35.6895 + (Math.random() - 0.5) * 0.12;
const randomLng = () => 139.6917 + (Math.random() - 0.5) * 0.12;

// テスト用ユーザー画像パス（public/user-icons/ に置く）
const images = [
  '/user-icons/cat1.png',
  '/user-icons/cat2.png',
  '/user-icons/cat3.png',
  '/user-icons/cat4.png',
  '/user-icons/cat5.png',
];

// 適当なユーザー名
const names = [
  'Mugi',
  'Reo',
  'Luna',
  'Sora',
  'Late',
  'Coco',
  'Kinako',
  'Moca',
  'Beru',
  'Lulu',
];

async function main() {
  // 既存データ削除（リセット用）
  await prisma.userLocation.deleteMany();
  await prisma.user.deleteMany();

  // ランダムに15人分のデータを生成
  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        name: names[i % names.length],
        email: `user${i + 1}@example.com`,
        image: images[i % images.length], // ランダム画像
      },
    });

    await prisma.userLocation.create({
      data: {
        userId: user.id,
        lat: randomLat(),
        lng: randomLng(),
        message: `${user.name} は新宿エリアにいます`,
      },
    });
  }

  console.log('テストデータを作成しました');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
