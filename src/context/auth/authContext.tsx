import { createContext } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
    loadUser: (token: string) => Promise<void>;
    authError: string | null;
    clearAuthError: () => void;
}

const authContext = createContext<AuthContextType>({
    isLoggedIn: false,
    login: async () => false,
    logout: () => { },
    register: async () => { },
    loadUser: async () => { },
    authError: null,
    clearAuthError: () => { },
});

export default authContext;
