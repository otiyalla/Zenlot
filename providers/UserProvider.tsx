import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { IUser, IUserContext, IUserPasswordChange } from '@/types';
import { useAuth } from "./AuthProvider";
import { userApi } from "@/api/user";
import { Socket, io } from "socket.io-client";
import { getBaseUrl } from "@/api";

const UserContext = createContext({} as IUserContext);

const UserProvider = ({ children }: {children: ReactNode}) => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const { user: authUser } = useAuth();
  const { update, changePassword } = userApi;

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);
  
  useEffect(() => {
    try {
      if (!authUser?.id) return;
    
      const socket: Socket = io(`${getBaseUrl()}/user`, {
        transports: ['websocket']
      });
  
      socket.on('connect', () => {
        console.log('User [WS] connected with ID ', socket.id)
      });
  
      const onUserUpdate = (payload: Partial<IUser> & { id: number}) => {
        if (payload?.id === authUser.id) {
          setUser((prev) => ({ ...prev, ...payload}))
        }
      };
  
      socket.on('updated-user', onUserUpdate);
  
      socket.on('connect_error', (err) => {
        console.error('User [WS] Connection error:', err.message);
      });
  
      socket.on('disconnect', () => {
        console.log('User [WS] Disconnected', socket.id);
      });
  
      return (() => {
        socket.off('updated-user', onUserUpdate);
        socket.disconnect();
      })
    } catch (error) {
      console.error('User [WS] error')
    }
  }, [authUser?.id])

  const updateUser =  async (updateInfo: IUser) => {
    await update(updateInfo);
  }

  const updatePassword = async (passwords: IUserPasswordChange):Promise<boolean> => {
    const success = await changePassword(passwords);
    return success;
  }

  const userService = {
    user,
    update: (user: IUser ) => updateUser(user),
    updatePassword
  }

  return (
    <UserContext.Provider value={userService}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}


export {UserContext, UserProvider, useUser};