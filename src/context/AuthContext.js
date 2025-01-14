'use client'
import { getUser } from "@/service/userService";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedAccounts = localStorage.getItem('accounts');

        if (storedToken) {
            setToken(storedToken);
        }
        if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken);
        }
        if (storedAccounts.length > 0) {
            setAccounts(storedAccounts);
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
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }
    }, [refreshToken]);

    useEffect(() => {
        if (accounts.length > 0) {
            localStorage.setItem('accounts', JSON.stringify(accounts));
        } else {
            localStorage.removeItem('accounts');
        }
    }, [accounts]);

    const addAccount = (token, refresh_token, email) => {
        setAccounts(prevAcconts => [...prevAcconts, { token, refresh_token, email }]);
    }

    const removeAccount = (token) => {
        setAccounts(prevAcconts => prevAcconts.filter(account => account.token !== token))
    }

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