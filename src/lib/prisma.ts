import { PrismaClient } from '@prisma/client';

const pgbouncerParams = {
  pgbouncer: 'true',
  statement_cache_size: '0',
};

function withPgbouncer(url?: string) {
  if (!url || !url.includes('pooler')) return url;
  try {
    const parsed = new URL(url);
    for (const [key, value] of Object.entries(pgbouncerParams)) {
      if (!parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, value);
      }
    }
    return parsed.toString();
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    const extras = Object.entries(pgbouncerParams)
      .filter(([key]) => !url.includes(`${key}=`))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return extras ? `${url}${separator}${extras}` : url;
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: withPgbouncer(process.env.DATABASE_URL),
      },
    },
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
