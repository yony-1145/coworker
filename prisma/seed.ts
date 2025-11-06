import { prisma } from '../src/lib/prisma';

async function main() {
  await prisma.userProfile.create({
    data: {
      userId: 'cmhm5bc6x00019oq40rbmkjle',
      displayName: '山田たろう',
      iconUrl: '/images/sample-icon.png',
      headline: '地方からWeb開発を発信しています',
      occupation: 'フリーランスエンジニア',
      affiliation: '個人事業主',
      location: '福岡県',
      age: 28,
      links: [
        { label: 'GitHub', url: 'https://github.com/yamada224' },
        { label: 'X', url: 'https://x.com/yamada224' },
      ],
      bioText: `福岡を拠点にフリーランスでWeb制作を行っています。
今後は地方の人たちをつなぐ仕組みをつくりたいです。`,
      tags: ['Web開発', 'リモートワーク', '地域活性化'],
    },
  });
}

main()
  .then(() => console.log('✅ Seed complete'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
