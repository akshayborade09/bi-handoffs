import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { supabaseAdmin } from "./supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      if (!supabaseAdmin) {
        console.error("Supabase admin client not configured");
        return false;
      }

      try {
        // Check if user exists
        const { data: existingUser } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();

        if (existingUser) {
          // Update existing user
          await supabaseAdmin
            .from("users")
            .update({
              name: user.name,
              image: user.image,
              google_id: account?.providerAccountId,
              updated_at: new Date().toISOString(),
            })
            .eq("email", user.email);
        } else {
          // Create new user
          await supabaseAdmin.from("users").insert({
            email: user.email,
            name: user.name,
            image: user.image,
            google_id: account?.providerAccountId,
          });
        }

        return true;
      } catch (error) {
        console.error("Error saving user to Supabase:", error);
        return false;
      }
    },
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // Google provides image in user.image, but also try profile.picture as fallback
        token.picture = user.image || (profile as any)?.picture || null;
        console.log("JWT callback - user.image:", user.image, "profile.picture:", (profile as any)?.picture);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Don't redirect to a separate login page
  },
});
