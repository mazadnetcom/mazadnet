import { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { AdminUser } from '../types';
import { useUsers } from './UsersContext';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: AdminUser | null;
  login: () => void;
  logout: () => void;
  isAccountPopoverOpen: boolean;
  setAccountPopoverOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAccountPopoverOpen, setAccountPopoverOpen] = useState(false);
  const { getUserById } = useUsers();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const adminUser = getUserById('currentUser');
      setCurrentUser(adminUser || null);
    } else {
      setCurrentUser(null);
    }
  }, [isLoggedIn, getUserById]);

  const login = useCallback(() => setIsLoggedIn(true), []);
  
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setAccountPopoverOpen(false);
  }, []);

  const setAccountPopoverOpenCallback = useCallback((isOpen: boolean) => {
    setAccountPopoverOpen(isOpen);
  }, []);

  const value = useMemo(() => ({ 
    isLoggedIn, 
    currentUser, 
    login, 
    logout, 
    isAccountPopoverOpen, 
    setAccountPopoverOpen: setAccountPopoverOpenCallback 
  }), [isLoggedIn, currentUser, login, logout, isAccountPopoverOpen, setAccountPopoverOpenCallback]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
