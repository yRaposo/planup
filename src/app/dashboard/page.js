'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/service/productService";
import ProductList from "@/components/ProductList";

export default function Home() {
    const [token, setToken] = useState(null)
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            console.log(storedToken);
        } else {
            router.push('/access');
        }
    }, [router]);

    return (
        <div className="flex flex-col gap-8 items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">
                Plan Up
                <ProductList />
            </h1>
        </div>
    )
}