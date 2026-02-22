import { createContext } from "react";

export interface AuthState {
    username: string;
    token: string;
    portals: string[];
}

export interface AuthContextType {
    auth: AuthState | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    auth: null,
    login: async () => { },
    logout: () => { }
});