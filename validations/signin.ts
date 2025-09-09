import * as z from "zod/v4";
export const signinValidationRegistry = z.registry<{ title: string; description: string }>();
export const signinValidation = z.object({
    email: z.email().register(signinValidationRegistry, { title: "Email", description: "The user email" }),
    password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).register(signinValidationRegistry, { title: "Password", description: "The user password" }),
})

