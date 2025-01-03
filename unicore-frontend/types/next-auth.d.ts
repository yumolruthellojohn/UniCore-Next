// types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        user_id: string
        user_fname: string
        user_lname: string
        user_type: string
        user_position: string
        dept_id: string
        user_status: string
    }
    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        fname: string
        lname: string
        role: string
        position: string
        dept_id: string
        status: string
    }
}