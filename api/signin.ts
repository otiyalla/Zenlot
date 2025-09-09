import resetpassword from '@/app/(auth)/resetpassword';
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

    async signout() {
        console.log('signout called');
        //return await api.delete('signout');
    },

    async refreshToken() {
        return await api.read('refresh-token');
    },

    async resetpassword(email: string) {
        console.log('the email: ', email)
        const res = await api.create(`auth/resetpassword`, email);
        return res;
    }
};