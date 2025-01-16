'use client'

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductList from "@/components/ProductList";
import { AuthContext } from "@/context/AuthContext";

export default function Products() {
    const { token, accounts } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!token && accounts === null || !token && accounts.length === 0 || !token && accounts === undefined) {
            router.push('/');
        }
    }, [token, router]);

    return (
        <div className="m-4 flex justify-between align-middle">
            <ProductList />
        </div>
    )
}