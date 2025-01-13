'use client'
import { getUser } from "@/service/userService";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token, router]);

    useEffect(() => {
        const checkTokenValidity = async () => {
            if (token) {
                try {
                    const response = await getUser(token);
                    if (response.status === 401) {
                        setToken(null);
                        setIsError(true);
                        router.push('/access');
                    }
                } catch (error) {
                    console.error("Erro ao verificar o token:", error);
                    setIsError(true);
                    setToken(null);
                    router.push('/access');
                }
            }
        };

        checkTokenValidity();
    }, [token, router]);

    return (
        <AuthContext.Provider value={{ token, setToken, refreshToken, setRefreshToken, isError, setIsError }}>
            {children}
        </AuthContext.Provider>
    );
}