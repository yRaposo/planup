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
        } else {
            router.push('/access');
        }
    }, [router]);

    return (
        <div className="m-4 flex justify-between align-middle">
            <ProductList />
        </div>
    )
}