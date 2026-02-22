const API_BASE = "http://localhost:5202/api";

import type { FilterCondition } from "../components/grid/types";

/* ============================
   TYPES
============================ */

export type ExportRequest = {
    page: number;
    pageSize: number;
    sortColumn: string;
    sortDirection: "asc" | "desc";
    filters: FilterCondition[];
};

/* ============================
   AUTH
============================ */

export const loginRequest = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE}/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return response.json();
};

/* ============================
   PORTALS
============================ */

export const getMyPortals = async (token: string) => {
    const response = await fetch(`${API_BASE}/Portals/my`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load portals");
    }

    return response.json();
};

/* ============================
   VIEWS
============================ */

export const getUsersView = async (slug: string, token: string) => {
    const response = await fetch(
        `${API_BASE}/portal/${slug}/views/users`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Errore caricamento utenti");
    }

    return response.json();
};

/* ============================
   EXPORT
============================ */

export const exportUsers = async (
    slug: string,
    token: string,
    body: ExportRequest
) => {
    const response = await fetch(
        `${API_BASE}/portal/${slug}/views/users/export`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        }
    );

    if (!response.ok) {
        throw new Error("Export failed");
    }

    return await response.blob();
};
