import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
        credentials: {
            email: {},
            password: {},
        },
        authorize: async (credentials) => {
            const email = credentials.email as string;
            const password = credentials.password as string;

            // console.log("Trying login for:", email);

            const user = await prisma.user.findUnique({ where: { email } });
            // console.log("User found?", !!user);

            if (!user) return null;

            const passwordsMatch = await bcrypt.compare(password, user.password);
            // console.log("Password match?", passwordsMatch);

            if (!passwordsMatch) return null;

            return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role,
            };
        },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.role = user.role;
        }
        return token;
        },
        async session({ session, token }) {
        if (session.user) {
            session.user.role = token.role as string;
        }
        return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});