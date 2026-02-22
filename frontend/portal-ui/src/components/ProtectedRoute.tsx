import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
    const { auth } = useAuth();

    if (!auth) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}