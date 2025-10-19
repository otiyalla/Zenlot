import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { signinApi } from './signin';


export const getBaseUrl = () => {
  if (__DEV__) {
    const host = (Platform.OS === "web") ? "localhost" :  Constants.expoConfig?.hostUri?.split(':')[0];
    return `http://${host}:3000`;
  }
  return 'https://your-production-url.com'; // Replace with actual prod server
};

const API_BASE_URL = getBaseUrl();
const authStorageKey = process.env.EXPO_PUBLIC_AUTH_TOKEN as string;
const authRefreshKey = process.env.EXPO_PUBLIC_AUTH_REFRESH_TOKEN as string;
const zen_user = process.env.EXPO_PUBLIC_USER_ID as string;

export const getTokens = async () => {
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

const refreshTokens = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem(authRefreshKey);
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        
        const data = { refresh_token: refreshToken };
        const result = await api.create(`auth/refresh`, data);
        
        if (result) {
            await AsyncStorage.setItem(authStorageKey, result.access_token);
            await AsyncStorage.setItem(authRefreshKey, result.refresh_token);
            return result.access_token;
        }
        throw new Error('Token refresh failed');
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

const makeAuthenticatedRequest = async (
    endpoint: string, 
    options: RequestInit, 
    retryCount = 0
): Promise<Response> => {
    const tokens = await getTokens();
    let retry = retryCount;
    
    if (tokens.access_token) {
        options.headers = {
            ...options.headers,
            'access_token': tokens.access_token,
            'refresh_access_token': tokens.refresh_token || '',
        };
    }
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    
    if (response.status === 401 && tokens.refresh_token && retry === 0 && endpoint !== 'auth/refresh') {
        try {

            const newAccessToken = await refreshTokens();
            options.headers = {
                ...options.headers,
                'access_token': newAccessToken,
                'refresh_access_token': tokens.refresh_token,
            };
            retry += 1;
            return fetch(`${API_BASE_URL}/${endpoint}`, options);
        } catch (refreshError) {
            console.error('Api: Token refresh failed:', refreshError);
            throw response;
        }
    }
    
    return response;
};

export const api = {
    async create<T>(endpoint: string, data: T, headers?: Record<string, string>) {
        const response = await makeAuthenticatedRequest(endpoint, {
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
        const response = await makeAuthenticatedRequest(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getHeaders(headers),
            },
        });
        return handleResponse(response);
    },

    async update<T>(endpoint: string, data: T, headers?: Record<string, string>) {
        const response = await makeAuthenticatedRequest(endpoint, {
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
        const response = await makeAuthenticatedRequest(endpoint, {
            method: 'DELETE',
            headers: {
                ...getHeaders(headers),
            },
        });
        return handleResponse(response);
    },
};

