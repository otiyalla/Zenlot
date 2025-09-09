import { createContext, useContext, useState, PropsWithChildren, useEffect, use } from 'react';
import { ILoginInfo, IUser, ISignUp, IAuthContext } from '@/types'; 
import { router, SplashScreen } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signinApi } from '@/api/signin';
import { email } from 'zod';
//TODO: Splash screen is not hiding on auth check, need to fix it

SplashScreen.preventAutoHideAsync();

const initialAuthState: IAuthContext = {
    isAuthenticated: false,
    authChecked: false,
    user: null,
    login: async () => {},
    logout: () => {},
    signup: async () => {},
    setUser: (user: IUser) => {},
    resetPassword: async (email: string): Promise<string> => { return ''; }
}
const AuthContext = createContext<IAuthContext>(initialAuthState);
const authStorageKey = 'zenlot-auth-token';
const authRefreshKey = 'zenlot-auth-token-refresh';
const zen_user = 'zenlot-user-id';
const AuthProvider = ({ children }: PropsWithChildren) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authChecked, setAuthChecked] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const { signin, signup: register, verify, resetpassword } = signinApi;

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await AsyncStorage.getItem(authStorageKey);
                const refreshToken = await AsyncStorage.getItem(authRefreshKey);
                if (!token || !refreshToken) {
                    logout();
                    return;
                }
                const user = await verify(token, refreshToken);
                if (!user) {
                    logout();
                    return;
                }
                setIsAuthenticated(user?.isAuthenticated ?? false);
                delete user.isAuthenticated;
                setUser(user);
                router.replace('/(protected)/(tabs)');
                
            } catch (error) {
                console.error('Failed to check auth status:', error);
                setIsAuthenticated(false);
                setUser(null);
            }
            setAuthChecked(true);
        };
        checkAuthStatus();
    }, [isAuthenticated]);

    const setAuthToken = async (state: {token: string, refresh_token: string, userId: number}) => {
        try {
            const token = state.token;
            const refresh_token = state.refresh_token;
            setIsAuthenticated(true);
            await AsyncStorage.setItem(authStorageKey, token);
            await AsyncStorage.setItem(authRefreshKey, refresh_token);
            await AsyncStorage.setItem(zen_user, state.userId.toString());
        } catch (error) {
            console.error('Failed to set auth token:', error);
        }
    };

    const clearAuthToken = async () => {
        try {
            await AsyncStorage.removeItem(authStorageKey);
            await AsyncStorage.removeItem(authRefreshKey);
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Failed to clear auth token:', error);
        }
    }

    useEffect(() => {
        if (authChecked) {
            (async () => {
                try {
                    await SplashScreen.hideAsync();
                } catch (error) {
                    console.error('Failed to hide splash screen:', error);
                }
            })();
        }
    }, [authChecked])

   
    const login = async (login_info: ILoginInfo) => {

        const {user, access_token, refresh_token}:{user: IUser, access_token: string, refresh_token: string} = await signin(login_info);
        if (!user) {
            throw new Error('Login failed');
        }
        const { isAuthenticated } = user
        setIsAuthenticated(isAuthenticated ?? false);
        delete user.isAuthenticated;
        console.log("user: ", user)
        setUser(user);
        await setAuthToken({token: access_token, refresh_token: refresh_token, userId: user.id}); 
        router.replace('/(protected)/(tabs)');
    };

    const signup = async (signup_info: ISignUp) => {
        const {user, access_token, refresh_token}:{user: IUser, access_token: string, refresh_token: string} = await register(signup_info);
        
        if (!user) {
            throw new Error('Sign up failed');
        }
        setIsAuthenticated(user.isAuthenticated ?? false); 
        delete user.isAuthenticated;
        setUser(user);
        await setAuthToken({token: access_token, refresh_token: refresh_token, userId: user.id}); 
        router.replace('/(protected)/(tabs)');
    };

    const resetPassword = async (email: string) => {
        return await resetpassword(email);
    }

    const logout = () => {
        clearAuthToken();
        setUser(null);
        setIsAuthenticated(false);
        console.log('User logged out:', isAuthenticated, user);
        router.replace('/(auth)');
    };
    
    const authState = {
        isAuthenticated,
        authChecked,
        user,
        login,
        logout,
        signup,
        setUser,
        resetPassword
    };
    
    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
    
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext, AuthProvider, useAuth };