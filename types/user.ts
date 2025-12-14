import { z } from 'zod';
import { signupValidation } from '@/validations';
import { LanguageOptionType } from '@/constants';

export interface IUser {
    id: number;
    fname: string;
    lname: string;
    email: string;
    role: 'user' | 'free' | 'trader';
    language: LanguageOptionType;
    theme: 'light' | 'dark' | 'system';
    accountCurrency: string;
    rules: {
        forex: {
            take_profit: {pips: number}[],
            stop_loss: {pips: number}[],
            lot_size?: number,
        }
    },
    tags?: string[];
    isAuthenticated?: boolean;
    togglePipValue?: boolean;
    timezone: string;
    createdAt: Date | string;
}

export interface IUserPasswordChange {
    currentPassword: string;
    newPassword: string;
}

export interface IUserContext {
    user: IUser;
    update: (user: IUser) => void;
    updatePassword: (passwords: IUserPasswordChange) => Promise<boolean>;
}
