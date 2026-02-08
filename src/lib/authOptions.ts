import CredentialsProvider from 'next-auth/providers/credentials';
import type { AuthOptions, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

type AppToken = JWT & { id?: string; email?: string };
type SessionUser = Session['user'] & { id?: string; email?: string };

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'メールアドレス', type: 'text' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        const appToken = token as AppToken;
        appToken.id = user.id;
        appToken.email = user.email ?? undefined;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        const appToken = token as AppToken;
        const sessionUser = session.user as SessionUser | undefined;
        if (sessionUser) {
          sessionUser.id = appToken.id;
          sessionUser.email = appToken.email;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
