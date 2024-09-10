import { object, string } from "zod";

export const signInSchema = object({
    user_idnum: string({ required_error: "ID Number is required" })
        .min(1, "ID Number is required"),
    user_password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
});