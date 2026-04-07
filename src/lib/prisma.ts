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

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      'DATABASE_URL が設定されていません。.env.local に接続文字列を設定してください。',
    );
  }
  return new PrismaClient({
    datasources: {
      db: {
        url: withPgbouncer(url),
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

/**
 * 遅延初期化: モジュール読み込み時に DATABASE_URL がなくても落ちない。
 * 初めて DB にアクセスするときに URL が無ければ例外になる。
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (prop === Symbol.toStringTag || typeof prop === 'symbol') {
      return undefined;
    }
    const client = getPrismaClient();
    const value = client[prop as keyof PrismaClient];
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
});
