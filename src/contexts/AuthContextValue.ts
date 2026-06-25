import { createContext } from 'react';
import type { Role, User } from '@/types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
