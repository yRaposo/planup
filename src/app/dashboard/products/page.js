'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductList from "@/components/ProductList";

export default function Products() {
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