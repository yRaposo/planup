'use client'

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductList from "@/components/ProductList";
import { AuthContext } from "@/context/AuthContext";

export default function Products() {
    const { token } = useContext(AuthContext);
    const router = useRouter();

    return (
        <div className="m-4 flex justify-between align-middle">
            <ProductList />
        </div>
    )
}