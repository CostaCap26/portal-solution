import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./app/AppRoutes";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root")!
).render(
    <React.StrictMode>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    </React.StrictMode>
);
