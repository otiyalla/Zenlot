import { api } from '.';
import { ISignUp } from '@/types';

export const signinApi = {
    async signin(data: { email: string; password: string }) {
        try {
            const res =  await api.create('auth/signin', data);
            return res;
        } catch (error) {
            console.error('sign in api', error);
        }
    },

    async signup(data: ISignUp) {
        const res = await api.create('auth/signup', data);
        return res;
    },

    async verify(token: string, refreshToken?: string) {
        const data = { token, refresh_token: refreshToken ?? "" };
        const res = await api.create(`auth/verify`, data);
        return res;
    },

    
    async refreshToken(refreshToken: string) {
        const data = { refresh_token: refreshToken };
        const res = await api.create(`auth/refresh`, data);
        return res;
    },

     async signout(userId?: number) {
        const res = await api.create(`auth/signout`, {userId});
        return res;
    },
    
    async resetpassword(email: string) {
        const res = await api.create(`auth/resetpassword`, { email });
        return res;
    }
};