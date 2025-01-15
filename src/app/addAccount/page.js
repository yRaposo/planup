'use client'
import AuthStatus from "@/components/AuthStatus";
import { getAccessToken } from "@/service/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext, Suspense } from "react";
import { AuthContext } from "@/context/AuthContext";
import SuspenseWrapper from "@/components/SuspenseWrapper";
import { getUser } from "@/service/userService";

function AccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [userEmail, setUserEmail] = useState([]);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const { addAccount, isError, setIsError } = useContext(AuthContext);
    const [code, setCode] = useState('');
    const [state, setState] = useState('');

    useEffect(() => {
        if (token && refreshToken && userEmail) {
            addAccount(token, refreshToken, userEmail);
            router.push('/dashboard/profile');
        }
    }, [token, refreshToken, userEmail, addAccount, router]);

    useEffect(() => {
        if (token) {
            getUser(token)
                .then((data) => {
                    setUserEmail(data.data.email);
                })
                .catch((error) => {
                    console.error('Erro ao obter Usuario:', error);
                })
        }
    }, [token]);

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            setCode(code);
        } else {
            const randomState = Math.random().toString(36).substring(2, 15);
            setState(randomState);
            window.location.href = `https://bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&state=${randomState}`;
        }
    }, [searchParams]);

    useEffect(() => {
        setIsError(false);
        if (code) {
            getAccessToken(code)
                .then((data) => {
                    if (data) {
                        setToken(data.access_token);
                        setRefreshToken(data.refresh_token);
                        setIsError(false);
                    }
                })
                .catch((error) => {
                    console.error('Erro ao obter Token', error);
                    setIsError(true);
                });
        }
    }, [code, setToken, setRefreshToken, setIsError]);

    return (
        <div className="flex flex-col gap-8 items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">
                Plan Up
            </h1>
            <AuthStatus isError={isError} token={token} code={code} />
        </div>
    );
}

export default function addAccount() {
    return (
        <SuspenseWrapper>
            <Suspense fallback={<div>Loading...</div>}>
                <AccessContent />
            </Suspense>
        </SuspenseWrapper>
    );
}