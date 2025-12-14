import { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { ILoginInfo, IUser, ISignUp, IAuthContext } from '@/types'; 
import { router, SplashScreen } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signinApi } from '@/api/signin';

const initialAuthState: IAuthContext = {
    isAuthenticated: false,
    authChecked: false,
    user: null,
    login: async () => {},
    logout: () => {},
    refreshAuthToken: () => {},
    signup: async () => {},
    setUser: (user: IUser) => {},
    resetPassword: async (email: string): Promise<string> => { return ''; }
}
const AuthContext = createContext<IAuthContext>(initialAuthState);

const authStorageKey = process.env.EXPO_PUBLIC_AUTH_TOKEN as string ?? 'zenlot-auth-token';
const authRefreshKey = process.env.EXPO_PUBLIC_AUTH_REFRESH_TOKEN as string ?? 'zenlot-auth-token-refresh';
const zen_user = process.env.EXPO_PUBLIC_USER_ID as string ?? 'zenlot-user-id';


try { SplashScreen.preventAutoHideAsync(); } catch {}

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const { signin, signup: register, verify, refreshToken, resetpassword, signout } = signinApi;

  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem(authStorageKey);
      await AsyncStorage.removeItem(authRefreshKey);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear auth token:', error);
    }
  };

  const logout = async () => {
    await clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/(auth)');
    signout(user?.id);
  };
  
  const refreshAuthToken = async () => {
    try {
        const refreshTokenValue = await AsyncStorage.getItem(authRefreshKey);
        if (!refreshTokenValue) {
            await logout();
            return;
        }
        const res = await refreshToken(refreshTokenValue);
        if (res) {
            await AsyncStorage.setItem(authStorageKey, res.access_token);
            await AsyncStorage.setItem(authRefreshKey, res.refresh_token);
            setIsAuthenticated(true);
        } else {
            await logout();
        }
    } catch (error) {
      console.error('Failed to refresh auth token:', error);
      await logout();
    }
 };

  useEffect(() => {
    let canceled = false;

    const checkAuthStatus = async () => {
      try {
        const [token, refreshTokenValue] = await Promise.all([
          AsyncStorage.getItem(authStorageKey),
          AsyncStorage.getItem(authRefreshKey),
        ]);

        if (!token && !refreshTokenValue) {
          await logout();
          return;
        }

        let userObj: any = null;
        let newTokens: { access_token: string; refresh_token: string } | null = null;

        try {
          userObj = await verify(token ?? '', refreshTokenValue ?? '');
          if (userObj?.access_token && userObj?.refresh_token) {
            newTokens = {
              access_token: userObj.access_token,
              refresh_token: userObj.refresh_token,
            };
            delete userObj.access_token;
            delete userObj.refresh_token;
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          if (refreshTokenValue) {
            try {
              const res = await refreshToken(refreshTokenValue);
              
              if (res) {
                userObj = res.user;
                newTokens = {
                  access_token: res.access_token,
                  refresh_token: res.refresh_token,
                };
              }
            } catch (e) {
              console.error('Auth: Token refresh failed:', e);
              await logout();
              return;
            }
          } else {
            await logout();
            return;
          }
        }

        if (!userObj) {
          await logout();
          return;
        }

        if (newTokens) {
          await AsyncStorage.setItem(authStorageKey, newTokens.access_token);
          await AsyncStorage.setItem(authRefreshKey, newTokens.refresh_token);
        }

        setIsAuthenticated(Boolean(userObj.isAuthenticated));
        delete userObj.isAuthenticated;
        setUser(userObj);

        router.replace('/(protected)/(tabs)');
      } catch (error) {
        console.error('Failed to check auth status:', error);
        await logout();
      } finally {
        if (!canceled) setAuthChecked(true); 
      }
    };

    checkAuthStatus();
    return () => { canceled = true; };
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    (async () => {
      try { await SplashScreen.hideAsync(); } catch {}
    })();
  }, [authChecked]);

  const setAuthToken = async (state: { token: string; refresh_token: string; userId: number }) => {
    try {
      setIsAuthenticated(true);
      await AsyncStorage.setItem(authStorageKey, state.token);
      await AsyncStorage.setItem(authRefreshKey, state.refresh_token);
      await AsyncStorage.setItem(zen_user, String(state.userId));
    } catch (error) {
      console.error('Failed to set auth token:', error);
    }
  };

  const login = async (login_info: ILoginInfo) => {
    const { user: u, access_token, refresh_token } = await signin(login_info);
    if (!u) throw new Error('Login failed');
    setIsAuthenticated(Boolean(u.isAuthenticated));
    const { id, ...rest } = u;
    const userClean = { id, ...rest } as IUser;
    delete (userClean as any).isAuthenticated;
    setUser(userClean);
    await setAuthToken({ token: access_token, refresh_token, userId: id });
    router.replace('/(protected)/(tabs)');
  };

  const signup = async (signup_info: ISignUp) => {
    const { user: u, access_token, refresh_token } = await register(signup_info);
    if (!u) throw new Error('Sign up failed');
    setIsAuthenticated(Boolean(u.isAuthenticated));
    delete (u as any).isAuthenticated;
    setUser(u);
    await setAuthToken({ token: access_token, refresh_token, userId: u.id });
    router.replace('/(protected)/(tabs)');
  };

  const resetPassword = (email: string) => resetpassword(email);

  const authState: IAuthContext = {
    isAuthenticated,
    authChecked,
    user,
    login,
    logout: () => { void logout(); },
    refreshAuthToken: () => { void refreshAuthToken(); },
    signup,
    setUser,
    resetPassword,
  };

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};


const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext, AuthProvider, useAuth };