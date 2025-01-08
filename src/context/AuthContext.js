'use client'
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isError, setIsError] = useState(false);

    return (
        <AuthContext.Provider value={{ token, setToken, refreshToken, setRefreshToken, isError, setIsError }}>
            {children}
        </AuthContext.Provider>
    );
}