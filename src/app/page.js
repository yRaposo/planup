'use client';
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Home() {

    const router = useRouter();
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            router.push('/access');
        } else {
            router.push('/dashboard');
        }
    }, [token, router]);

    return (null);
}