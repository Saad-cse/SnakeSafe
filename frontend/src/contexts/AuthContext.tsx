import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../services/demoData';

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  setUser: (user: User) => void;
  allDemoUsers: User[];
}

const AUTH_STORAGE_KEY = 'snakesafe_current_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEMO_USERS[0]; // Default to Patient
  });

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    const matched = DEMO_USERS.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  const setUser = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, setUser, allDemoUsers: DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
