import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { IUser, IUserContext } from '@/types';
import { useAuth } from "./AuthProvider";

const UserContext = createContext({} as IUserContext);


const UserProvider = ({ children }: {children: ReactNode}) => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const { user: authUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const updateUser = (update: IUser) => {
    setUser((prev: IUser) => ({ ...prev, ...update }));

    //TODO: Update user in the backend
  }

  const userService = {
    user,
    update: (user: IUser ) => updateUser(user)
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