import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';


export const getBaseUrl = () => {
  if (__DEV__) {
    const host = (Platform.OS === "web") ? "localhost" :  Constants.expoConfig?.hostUri?.split(':')[0];
    return `http://${host}:3000`;
  }
  return 'https://your-production-url.com'; // Replace with actual prod server
};


const API_BASE_URL = getBaseUrl();

export const getTokens = async () => {
    const authStorageKey = 'zenlot-auth-token';
    const authRefreshKey = 'zenlot-auth-token-refresh';
    const zen_user = 'zenlot-user-id';
    const access_token = await AsyncStorage.getItem(authStorageKey);
    const refresh_token = await AsyncStorage.getItem(authRefreshKey);
    const id = await AsyncStorage.getItem(zen_user);
    return { access_token, refresh_token, userId: Number(id)};
}


const getHeaders = (customHeaders?: Record<string, string>) => ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    ...customHeaders,
});

const handleResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type');
    
    const data = contentType && contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    if (!response.ok) {
        throw { status: response.status, data };
    }
    return data;
};

export const api = {
    async create<T>(endpoint: string, data: T, headers?: Record<string, string>) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...getHeaders(headers),
            },
        });
        return handleResponse(response);
    },

    async read(endpoint: string, headers?: Record<string, string>) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getHeaders(headers),
            },
        });
        return handleResponse(response);
    },

    async update<T>(endpoint: string, data: T, headers?: Record<string, string>) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getHeaders(headers),
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async delete(endpoint: string, headers?: Record<string, string>) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                ...getHeaders(headers),
            },
        });
        return handleResponse(response);
    },
};

