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
    const localUsersStr = localStorage.getItem('recruiter_registered_users');
    const localUsers = localUsersStr ? JSON.parse(localUsersStr) : [];
    const allUsers = [...seedUsers, ...localUsers];

    const matchingUser = allUsers.find(
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

  const signUp = (name: string, email: string, password: string, role: Role) => {
    const localUsersStr = localStorage.getItem('recruiter_registered_users');
    const localUsers = localUsersStr ? JSON.parse(localUsersStr) : [];
    const allUsers = [...seedUsers, ...localUsers];

    if (allUsers.some(u => u.email === email.trim().toLowerCase())) {
      return false;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      displayName: name,
      email: email.trim().toLowerCase(),
      password,
      role
    };

    localUsers.push(newUser);
    localStorage.setItem('recruiter_registered_users', JSON.stringify(localUsers));

    const userWithoutPassword: User = {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
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
    <AuthContext.Provider value={{ user, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
