import { useState, ReactNode } from "react";
import { AuthContext, AuthState } from "./AuthContext";

function decodeToken(token: string): Record<string, unknown> {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded) as Record<string, unknown>;
}

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {

    const [auth, setAuth] = useState<AuthState | null>(() => {
        const stored = localStorage.getItem("auth");
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (username: string, password: string) => {
        const response = await fetch("http://localhost:5202/api/Auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();

        const decoded = decodeToken(data.token);
        console.log("DECODED TOKEN:", decoded);

        // 🔥 gestione robusta claim portal
        const portalsRaw =
            (decoded["portal"] as string[] | string | undefined) ??
            (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/portal"] as string[] | string | undefined) ??
            [];

        const portals = Array.isArray(portalsRaw)
            ? portalsRaw
            : portalsRaw
                ? [portalsRaw]
                : [];

        const authData: AuthState = {
            username: data.username,
            token: data.token,
            portals
        };

        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem("auth");
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}