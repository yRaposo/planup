'use client'
import AuthStatus from "@/components/AuthStatus";
import { getAccessToken } from "@/service/authService";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState();
  const [token, setToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [isError, setIsError] = useState(false);
  const [state, setState] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setCode(code);
    } else {
      const randomState = Math.random().toString(36).substring(2, 15);
      setState(randomState);
      window.location.href=`https://bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&state=${randomState}`;
    }
  }, [searchParams]);

  useEffect(() => {
    if (code) {
      getAccessToken(code)
        .then((data) => {
          if (data) {
            setToken(data.access_token);
            setRefreshToken(data.refresh_token);
          } else {
            setIsError(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setIsError(true);
        });
    }
  }, [code]);

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">
        Plan Up
      </h1>
      <AuthStatus isError={isError} token={token} code={code} />
    </div>
  );
}