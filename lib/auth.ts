import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          isVerified: user.isVerified,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow callback URLs that are on the same origin
      if (url.startsWith(baseUrl)) return url;
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
    async jwt({ token, user }) {
      // On sign in, user object is available
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isVerified = user.isVerified || false;
        token.role = user.role || "USER";
        return token;
      }

      // On subsequent requests, validate against database
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (!dbUser) {
          // For Google OAuth users, create the user if they don't exist
          if (token.name && token.email && token.picture) {
            const newUser = await prisma.user.create({
              data: {
                email: token.email,
                username: token.name,
                password: "", // OAuth users don't have passwords
                isVerified: true, // Google OAuth users are pre-verified
                role: "USER",
              },
            });
            token.userId = newUser.id.toString();
            token.isVerified = true;
            token.role = "USER";
            return token;
          } else {
            // User doesn't exist - clear all user-specific data from token
            // This effectively invalidates the session
            return {
              ...token,
              userId: undefined,
              isVerified: undefined,
              role: undefined,
              email: undefined,
            };
          }
        }

        token.userId = dbUser.id.toString();
        token.isVerified = dbUser.isVerified;
        token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      // Only populate session if token has valid user data
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
        session.user.isVerified = token.isVerified;
        session.user.role = token.role;
      } else {
        // No valid user data, return minimal session
        return {
          ...session,
          user: undefined,
        }; // This is safer since session structure is being preserved
      }
      return session;
    },
  },
};
