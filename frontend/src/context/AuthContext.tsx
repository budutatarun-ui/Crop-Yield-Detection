import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirm: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('access_token');
    
    if (token) {
      auth.getProfile()
        .then(user => {
          setUser(user);
          setIsLoading(false);
        })
        .catch(() => {
          // Token might be expired, clear it
          auth.logout();
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, remember: boolean = false) => {
    setIsLoading(true);
    
    try {
      const response = await auth.login(email, password);
      setUser(response.user);
      setIsLoading(false); // Set loading to false after successful login
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, password_confirm: string) => {
    setIsLoading(true);
    
    try {
      await auth.register(name, email, password, password_confirm);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
