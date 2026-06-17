import React, { useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContextValue';
import { seedUsers } from '@/data/seed';
import { Role, User } from '@/types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('recruiter_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, role: Role) => {
    const matchingUser = seedUsers.find(
      (account) => account.email === email.trim().toLowerCase() && account.password === password && account.role === role,
    );

    if (!matchingUser) {
      return false;
    }

    const userWithoutPassword: User = {
      id: matchingUser.id,
      email: matchingUser.email,
      displayName: matchingUser.displayName,
      role: matchingUser.role,
      photoURL: matchingUser.photoURL,
    };
    setUser(userWithoutPassword);
    localStorage.setItem('recruiter_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('recruiter_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
