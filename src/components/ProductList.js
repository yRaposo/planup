'use client'
import { getProducts } from "@/service/productService";
import { useState, useEffect, use } from "react";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            console.log(storedToken);
        }
    }, []);

    useEffect(() => {
        getProducts(1, 100, token)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });

    })

    return (
        <div>
            <h1>Lista de Produtos</h1>
            <ul>
                {products.map((product) => {
                    return (
                        <li key={product.produto.id}>
                            {product.produto.codigo} - {product.produto.descricao}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}