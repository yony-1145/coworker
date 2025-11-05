import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const sessionMaxAge = 14 * 24 * 60 * 60; // 14日にトークン有効期限を指定
const sessionUpdateAge = 24 * 60 * 60; // 24時間ごとにセッションを更新

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: sessionMaxAge,
    updateAge: sessionUpdateAge,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };
