import { createContext, useContext, useState, PropsWithChildren, useEffect, use } from 'react';
import { IUser } from '@/types'; 
import { router, SplashScreen } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
//TODO: Splash screen is not hiding on auth check, need to fix it

SplashScreen.preventAutoHideAsync();

interface IAuthContext {
    isAuthenticated: boolean;
    authChecked: boolean;
    user: IUser | null;
    login: (login_info: any) => Promise<void>;
    logout: () => void;
    signup: (signup_info: ISignUp) => void;
    setUser: (user: any) => void;
}

interface ISignUp {
    fname: string;
    lname: string;
    email: string;
    password: string;
    language: string;
}

const initialAuthState: IAuthContext = {
    isAuthenticated: false,
    authChecked: false,
    user: null,
    login: async () => {},
    logout: () => {},
    signup: () => {},
    setUser: () => {},
}
const AuthContext = createContext<IAuthContext>(initialAuthState);
const authStorageKey = 'zenlot-auth-token';
const AuthProvider = ({ children }: PropsWithChildren) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authChecked, setAuthChecked] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            //await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate async operation
            try {
                const token = await AsyncStorage.getItem(authStorageKey);
                if (token) {
                    setIsAuthenticated(true);
                    // Optionally, you can fetch user data here if needed
                    const storedUser = JSON.parse(token); // Assuming token is a JSON string with user data
                    setUser(storedUser);
                    console.log('User authenticated:', storedUser);
                    router.replace('/(protected)/(tabs)'); 
                } 
            } catch (error) {
                console.error('Failed to check auth status:', error);
                setIsAuthenticated(false);
                setUser(null);
            }
            setAuthChecked(true);
            console.log('Auth status checked:', isAuthenticated, user);
        };
        checkAuthStatus();
    }, []);

    const setAuthToken = async (state: {token: string}) => {
        try {
            const token = JSON.stringify(state.token); // Assuming state.token is a string or object
            setIsAuthenticated(true);
            await AsyncStorage.setItem(authStorageKey, token);
        } catch (error) {
            console.error('Failed to set auth token:', error);
        }
    };

    const clearAuthToken = async () => {
        try {
            await AsyncStorage.removeItem(authStorageKey);
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

   
    const login = async (login_info: {email: string, password: string}) => {
        const user:IUser = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 1,
                    fname: 'John',
                    lname: 'Doe',
                    email: 'test@email.com',
                    role: 'user',
                    language: 'fr',
                });
            }, 1000);
        });
        if (!user) {
            throw new Error('Login failed');
        }
        setUser(user);
        setIsAuthenticated(true);
        await setAuthToken({token: JSON.stringify(user)}); 
        console.log('User logged in:', isAuthenticated, user);
        router.replace('/(protected)/(tabs)');
    };

    const signup = async (signup_info: ISignUp) => {
        const user:IUser = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 1,
                    fname: 'James',
                    lname: 'Bond',
                    email: 'jame@email.com',
                    role: 'user',
                    language: 'en',
                });
            }, 1000);
        });
        if (!user) {
            throw new Error('Sign up failed');
        }
        setUser(user);
        setIsAuthenticated(true);
        await setAuthToken({token: JSON.stringify(user)}); 
        console.log('User logged in:', isAuthenticated, user);
        router.replace('/(protected)/(tabs)');
    };

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
        login: login,
        logout: logout,
        signup: signup,
        setUser: setUser,
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