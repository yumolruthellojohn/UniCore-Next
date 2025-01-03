import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import axios from 'axios';
import { ip_address } from '@/app/ipconfig';

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
                    const response = await axios.post(`http://${ip_address}:8081/login`, {
                        user_idnum: credentials.user_idnum,
                        user_password: credentials.user_password
                    });

                    if (!Object.keys(response.data).length) {
                        console.log("Invalid credentials");
                    }
                    else if (Object.keys(response.data).length)
                    {
                        if (response.data[0].user_status === "Deactivated")
                        {
                            console.log("Account deactivated. Contact Administrator for help.");
                        }
                        else if (response.data[0].user_status === "Activated")
                        {
                            user = response.data[0];
                            console.log(response.data[0]);
                            console.log(user);
                            return user;
                        }
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
            const user_position = auth?.user.user_position;
            console.log(user_type);
            if (pathname.startsWith('/auth/login') && isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl));
            }
            if (pathname.startsWith("/admin") && user_type !== "Administrator") {
                return Response.redirect(new URL('/', nextUrl));
            }
            if (pathname.startsWith("/technical") && user_type !== "Technical Staff") {
                return Response.redirect(new URL('/', nextUrl));
            }
            if (pathname.startsWith("/nontechnical") && user_type !== "Non-technical Staff") {
                return Response.redirect(new URL('/', nextUrl));
            }
            if (pathname.startsWith("/service") && user_position !== "Service Staff") {
                return Response.redirect(new URL('/', nextUrl));
            }
            return !!auth;
        },
        jwt: ({ token, user, trigger, session }) => {
            if (user) {
                token.id = user.user_id as string;
                token.fname = user.user_fname as string;
                token.lname = user.user_lname as string;
                token.role = user.user_type as string;
                token.position = user.user_position as string;
                token.dept_id = user.dept_id as string;
                token.status = user.user_status as string;
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }
            return token;
        },
        session: ({ session, token }) => {
            session.user.user_id = token.id;
            session.user.name = token.fname + " " + token.lname;
            session.user.user_fname = token.fname;
            session.user.user_lname = token.lname;
            session.user.user_type = token.role;
            session.user.user_position = token.position;
            session.user.dept_id = token.dept_id;
            session.user.user_status = token.status;
            return session;
        }
    },
    pages: {
        signIn: "/auth/login",
    }
})