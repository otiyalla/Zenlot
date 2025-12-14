import { api, getTokens } from '.';
import { IUser, IUserPasswordChange } from '@/types';


export const userApi = {
    async getUser(id: string) {
        const { access_token, refresh_token } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        const url = `user/${id}`;
        return await api.read(url, headers);
    },

    async update(data: IUser) {
        const { access_token, refresh_token, userId } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        const {id} = data;
        return await api.update(`user/${id}`, data, headers);
    },

    async changePassword(data: IUserPasswordChange) {
        const { access_token, refresh_token, userId } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        return await api.create(`user/change-password`, { ...data, userId}, headers);
    },

    async deleteUser(id: number) {
        const { access_token, refresh_token } = await getTokens();
        const headers = {
            access_token: access_token || '',
            refresh_token: refresh_token || '',
        };
        return await api.delete(`user/${id}`, headers);
    },

};