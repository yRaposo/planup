'use client'
import AuthStatus from "@/components/AuthStatus";
import { getAccessToken } from "@/service/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext, Suspense } from "react";
import { AuthContext } from "@/context/AuthContext";
import SuspenseWrapper from "@/components/SuspenseWrapper";

function AccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, setToken, refreshToken, setRefreshToken, isError, setIsError } = useContext(AuthContext);
  const [code, setCode] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

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
    if (code) {
      getAccessToken(code)
        .then((data) => {
          if (data) {
            setToken(data.access_token);
            setRefreshToken(data.refresh_token);
            setIsError(false);
          } else {
            setIsError(true);
          }
        })
        .catch((error) => {
          console.error(error);
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

export default function Access() {
  return (
    <SuspenseWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <AccessContent />
      </Suspense>
    </SuspenseWrapper>
  );
}