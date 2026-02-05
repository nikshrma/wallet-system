import { prisma } from "@repo/db/client";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                name: { label: 'Name', type: 'text', placeholder: 'Nikhil Sharma' },
                phone: { label: 'Phone Number', type: 'text', placeholder: '1234567890' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials: any) {
                //TODO:Add zod validation
                // Ensure credentials and required fields exist
                if (!credentials?.phone || !credentials.password) return null;

                const existingUser = await prisma.user.findFirst({
                    where: {
                        number: credentials.phone
                    }
                });

                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            number: existingUser.number
                        }
                    }
                    return null;
                }

                try {
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    const user = await prisma.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPassword,
                            name: credentials.name
                        }
                    });

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        number: user.number
                    }
                }
                catch (e) {
                    console.error(e);
                }
                return null;
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || "localSecret",
    callbacks: {
        token: async ({ token, user }: any) => {
            if (user) {
                token.id = user.id;
                token.sub = user.id;
            }
            return token;
        },
        session: async ({ session, token }: any) => {
            if (session && session.user) {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id || token.sub
                    }
                }
            }
            return session;
        }
    }
}