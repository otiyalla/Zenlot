import { z } from 'zod';
import { signupValidation } from '@/validations';

export interface IUser {
    id: number;
    fname: string;
    lname: string;
    email: string;
    role: 'user' | 'free';
    language: 'en' | 'fr';
    accountCurrency: string;
    rules: {
        forex: {
            take_profit: {pips: number}[],
            stop_loss: {pips: number}[]
        }
    },
    isAuthenticated?: boolean;
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
