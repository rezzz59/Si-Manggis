import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const staff = await prisma.staff.findUnique({
          where: { email: credentials.email as string },
        });

        if (!staff) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          staff.password
        );

        if (!valid) return null;

        return { id: staff.id, email: staff.email, name: staff.nama };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
});
