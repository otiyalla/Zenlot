import * as z from "zod/v4";
export const userValidationRegistry = z.registry<{ title: string; description: string }>();
export const userInfoValidation = z.object({
    id: z.number().register(userValidationRegistry, { title: "User id", description: "The user unique id"}),
    fname: z.string().min(2).register(userValidationRegistry, { title: "First Name", description: "The user first name" }),
    lname: z.string().min(2).register(userValidationRegistry, { title: "Last Name", description: "The user last name" }),
    email: z.email().register(userValidationRegistry, { title: "Email", description: "The user email" }),
    language: z.enum(["en", "fr"]).register(userValidationRegistry, { title: "Language", description: "The user language" }),
    role: z.enum(["user", "free"]).register(userValidationRegistry, { title: "Role", description: "The user role" }),
    accountCurrency: z.string().min(3).register(userValidationRegistry, { title: "Account Currency", description: "The user account currency" }),
    password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).register(userValidationRegistry, { title: "Password", description: "The user password" }),
    rules: z.object({
        forex: z.object({
            take_profit: z.object({ pips: z.number() }).array().register(userValidationRegistry, { title: "Take Profit", description: "The user take profit" }),
            stop_loss: z.object({ pips: z.number() }).array().register(userValidationRegistry, { title: "Stop Loss", description: "The user stop loss" }),
        })
    }).register(userValidationRegistry, { title: "Rules", description: "The user rules" })
});

export const userPasswordValidation = z.object({
    newPassword: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).register(userValidationRegistry, { title: "New Password", description: "The user new password" }),
})