import * as z from "zod/v4";
import { LanguageOptionEnum } from "@/constants/languageKeys";
export const signupValidationRegistry = z.registry<{ title: string; description: string }>();
export const signupValidation = z.object({
    fname: z.string().min(2).register(signupValidationRegistry, { title: "First Name", description: "The user first name" }),
    lname: z.string().min(2).register(signupValidationRegistry, { title: "Last Name", description: "The user last name" }),
    email: z.email().register(signupValidationRegistry, { title: "Email", description: "The user email" }),
    language: z.enum(LanguageOptionEnum).register(signupValidationRegistry, { title: "Language", description: "The user language" }),
    role: z.string().optional().register(signupValidationRegistry, { title: "Role", description: "The user role" }),
    timezone: z.string().register(signupValidationRegistry, {title: "Timezone", description: "The timezone of the user"}),
    accountCurrency: z.string().min(3).register(signupValidationRegistry, { title: "Account Currency", description: "The user account currency" }),
    password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).register(signupValidationRegistry, { title: "Password", description: "The user password" }),
    rules: z.object({
        forex: z.object({
            take_profit: z.object({ pips: z.number() }).array().register(signupValidationRegistry, { title: "Take Profit", description: "The user take profit" }),
            stop_loss: z.object({ pips: z.number() }).array().register(signupValidationRegistry, { title: "Stop Loss", description: "The user stop loss" }),
        })
    }).register(signupValidationRegistry, { title: "Rules", description: "The user rules" })
})

