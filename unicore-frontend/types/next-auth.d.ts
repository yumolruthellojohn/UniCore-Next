// types/next-auth.d.ts

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        user_id: string
        user_type: string
    }
    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
    }
}