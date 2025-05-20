import { createContext } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
    loadUser: (token: string) => Promise<void>;
}

const authContext = createContext<AuthContextType>({
    isLoggedIn: false,
    login: async () => { },
    logout: () => { },
    register: async () => { },
    loadUser: async () => { },
});

export default authContext;
