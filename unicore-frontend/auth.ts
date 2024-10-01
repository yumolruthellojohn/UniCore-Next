import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import axios from 'axios';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                user_idnum: { label: "ID Number", type: "number", placeholder: "ID Number" },
                user_password: { label: "Password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {

                // validate credentials
                const parsedCredentials = signInSchema.safeParse(credentials);
                if (!parsedCredentials.success) {
                    console.error("Invalid credentials:", parsedCredentials.error.errors);
                    return null;
                }

                // get user
                
                try {
                    let user = null;
                    const response = await axios.post('http://localhost:8081/login', {
                        user_idnum: credentials.user_idnum,
                        user_password: credentials.user_password
                    });

                    if (!Object.keys(response.data).length) {
                        console.log("Invalid credentials");
                    }
                    else if (Object.keys(response.data).length)
                    {
                        user = response.data[0];
                        console.log(response.data[0]);
                        console.log(user);
                        return user;
                    }

                    return null;

                } catch (error) {
                    console.error('Error during authentication:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        authorized({ request: { nextUrl }, auth }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;
            const user_type = auth?.user.user_type;
            console.log(user_type);
            if (pathname.startsWith('/auth/login') && isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl));
            }
            if (pathname.startsWith("/admin") && user_type !== "Administrator") {
                return Response.redirect(new URL('/', nextUrl));
            }
            return !!auth;
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.user_id as string;
                token.fname = user.user_fname as string;
                token.lname = user.user_lname as string;
                token.role = user.user_type as string;
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }
            return token;
        },
        session({ session, token }) {
            session.user.user_id = token.id;
            session.user.name = token.fname + " " + token.lname;
            session.user.user_type = token.role;
            return session;
        }
    },
    pages: {
        signIn: "/auth/login",
    }
})