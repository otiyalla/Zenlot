export interface IUser {
    id: number;
    fname: string;
    lname: string;
    email: string;
    role: 'user' | 'admin';
    language: 'en' | 'fr';
}

export interface IUserContext {
    user: IUser | null;
    update: (user: IUser) => void;
}
