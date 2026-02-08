import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        try {
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (err) {
          throw new Error(err.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const now = Date.now();
      const ACCESS_TOKEN_EXPIRY = 5 * 60 * 1000; // 5 minutes
      const REFRESH_TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes of inactivity

      // Initial sign in
      if (user) {
        token.id = user.id;
        token.accessTokenExpires = now + ACCESS_TOKEN_EXPIRY;
        token.refreshTokenExpires = now + REFRESH_TOKEN_EXPIRY;
        return token;
      }

      // Handle existing sessions without expiry fields (migration) 
      if (!token.accessTokenExpires) {
          token.accessTokenExpires = now + ACCESS_TOKEN_EXPIRY;
          token.refreshTokenExpires = now + REFRESH_TOKEN_EXPIRY;
      }

      // Check if refresh token is expired (Hard Stop)
      if (now >= token.refreshTokenExpires) {
        return { ...token, error: "RefreshAccessTokenError" };
      }

      // If here, refresh token is valid (user is active or within window)
      // Slide the refresh token window (Inactivity reset)
      token.refreshTokenExpires = now + REFRESH_TOKEN_EXPIRY;

      // Check access token
      if (now >= token.accessTokenExpires) {
        // Access token expired, rotate it
        token.accessTokenExpires = now + ACCESS_TOKEN_EXPIRY;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        return null; // Invalid session
      }
      
      if (token) {
        session.user.id = token.id;
        session.accessTokenExpires = token.accessTokenExpires;
        session.refreshTokenExpires = token.refreshTokenExpires;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
