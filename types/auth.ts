import { IUser } from './user';

export interface IAuthContext {
    isAuthenticated: boolean;
    authChecked: boolean;
    user: IUser | null;
    login: (login_info: ILoginInfo) => Promise<void>;
    logout: () => void;
    signup: (signup_info: ISignUp) => void;
    setUser: (user: IUser) => void;
    resetPassword: (email: string) => Promise<string>;
}

export interface ISignUp {
    fname: string;
    lname: string;
    email: string;
    password: string;
    language: string;
    accountCurrency: string;
    rules: {
        forex: {
            take_profit: { pips: number}[];
            stop_loss: { pips: number}[];
        }
    };
}

export interface ILoginInfo {
    email: string, 
    password: string
}