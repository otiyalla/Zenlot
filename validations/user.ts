import * as z from "zod/v4";
import { LanguageOptionEnum } from "@/constants/languageKeys";
export const userValidationRegistry = z.registry<{ title: string; description: string }>();
export const userInfoValidation = z.object({
    id: z.number().register(userValidationRegistry, { title: "User id", description: "The user unique id"}),
    fname: z.string().min(2).register(userValidationRegistry, { title: "First Name", description: "The user first name" }),
    lname: z.string().min(2).register(userValidationRegistry, { title: "Last Name", description: "The user last name" }),
    email: z.email().register(userValidationRegistry, { title: "Email", description: "The user email" }),
    language: z.enum(LanguageOptionEnum).register(userValidationRegistry, { title: "Language", description: "The user language" }),
    togglePipValue: z.boolean().optional().register(userValidationRegistry, { title: "Toggle Pip Value", description: "The user toggle to see either pip value or currency value" }),
    theme: z.enum(["light", "dark", "system"]).register(userValidationRegistry, {title: "The user appearance", description: "The appearance of the user app"}),
    role: z.enum(["user", "free", "trader"]).register(userValidationRegistry, { title: "Role", description: "The user role" }),
    accountCurrency: z.string().min(3).register(userValidationRegistry, { title: "Account Currency", description: "The user account currency" }),
    timezone: z.string().register(userValidationRegistry, {title: "Timezone", description: "The timezone of the user"}),
    createdAt: z.union([z.date(), z.string()]).register(userValidationRegistry, {title: "Creation date", description: "The date the user was created"}),
    rules: z.object({
        forex: z.object({
            take_profit: z.object({ pips: z.number() }).array().register(userValidationRegistry, { title: "Take Profit", description: "The user take profit" }),
            stop_loss: z.object({ pips: z.number() }).array().register(userValidationRegistry, { title: "Stop Loss", description: "The user stop loss" }),
            lot_size: z.number().optional().register(userValidationRegistry, { title: "Lot Size", description: "The user default lot size" }),
        })
    }).register(userValidationRegistry, { title: "Rules", description: "The user rules" }),
    tags: z.array(z.string()).optional().register(userValidationRegistry, { title: "Tags", description: "The user trade tags" }),
});

export const userPasswordValidation = z.object({
    newPassword: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).register(userValidationRegistry, { title: "New Password", description: "The user new password" }),
})