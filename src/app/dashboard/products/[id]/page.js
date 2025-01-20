'use client'
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { use, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMountainSun } from "react-icons/fa6";
import { MdArrowBackIos, MdEdit } from "react-icons/md";
import { LiaPlusSolid } from "react-icons/lia";

import LaunchModal from '@/components/LaunchModal';
import StylezedBtn from '@/components/StylezedBtn';
import { AuthContext } from '@/context/AuthContext';
import EditModal from '@/components/EditModal';
import { getDepositoByIdQ, getEstoqueQ, getProductByIdQ, getProductsQ, getUserQ } from '@/utils/requestQueue';
import Product from '@/components/Product';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { token, accounts } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [modal, setModal] = useState('');
    const [estoque, setEstoque] = useState([]);
    const [productAccounts, setProductAccounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [deposits, setDeposits] = useState({});

    const fetchProductById = useCallback(async () => {
        if (token) {
            try {
                const data = await getProductByIdQ(id, token);
                setProduct(data.data);
                console.log(data.data);
            } catch (error) {
                console.error('Erro ao obter o produto por id:', error);
            }
        }
    }, [id, token]);

    useEffect(() => {
        fetchProductById();
    }, [fetchProductById]);

    const fetchProducts = useCallback(async () => {
        if (product) {
            const productsData = [];
            const accountsWithProduct = {};
            for (const account of accounts) {
                if (account.token) {
                    try {
                        const data = await getProductsQ(1, 1, account.token, product.codigo);
                        const newProducts = data.data.filter(newProduct =>
                            newProduct.codigo === product.codigo &&
                            !productsData.some(existingProduct => existingProduct.id === newProduct.id)
                        );
                        productsData.push(...newProducts);

                        if (newProducts.length > 0) {
                            accountsWithProduct[account.token] = newProducts;
                        }

                        console.log('produto: ', data);
                    } catch (error) {
                        console.error('Erro ao obter produtos:', error);
                    }
                }
            }
            setAllProducts(productsData);
            setProductAccounts(accountsWithProduct);
        }
    }, [product, accounts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const fetchEstoque = useCallback(async () => {
        if (token) {
            try {
                const data = await getEstoqueQ(id, token);
                console.log(data.data[0]);
                setEstoque(data.data[0]);
            } catch (error) {
                console.error('Erro ao obter estoques:', error);
            }
        }
    }, [id, token]);

    useEffect(() => {
        fetchEstoque();
    }, [fetchEstoque]);

    const fetchDeposits = useCallback(async () => {
        if (productAccounts) {
            const depositsPerAccountData = {};
            for (const accountToken of Object.keys(productAccounts)) {
                const estoqueData = [];
                const depositsData = [];

                for (const product of productAccounts[accountToken]) {
                    try {
                        const data = await getEstoqueQ(product.id, accountToken);
                        estoqueData.push(...data.data[0].depositos);
                    } catch (error) {
                        console.error('Erro ao obter estoques:', error);
                    }
                }

                for (const deposit of estoqueData) {
                    try {
                        const data = await getDepositoByIdQ(deposit.id, accountToken);
                        depositsData.push(data.data);
                        console.log('deposito: ', data);
                    } catch (error) {
                        console.error('Erro ao obter depósitos:', error);
                    }
                }
                depositsPerAccountData[accountToken] = depositsData;
            }
            setDeposits(depositsPerAccountData);
        }
    }, [productAccounts]);

    useEffect(() => {
        fetchDeposits();
    }, [fetchDeposits]);

    console.log('Produtos: ', allProducts);
    console.log('Produto: ', product);
    console.log('Contas com produto: ', productAccounts);
    console.log('Depósitos: ', deposits);

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse rounded-full h-12 w-12 bg-gray-400"></div>
            </div>
        )
    }

    return (
        <div className="m-4">
            <div className='flex justify-between gap-4'>
                <div className='hidden md:flex justify-between gap-4'>
                    <StylezedBtn props={{ icon: <MdArrowBackIos />, text: 'Voltar' }} onClick={() => router.push('/dashboard/products')} />
                </div>
                <div className="flex justify-between w-full md:w-auto md:gap-4">
                    <StylezedBtn props={{ icon: <MdEdit />, text: 'Editar' }} onClick={() => setModal('edit')} />
                    <StylezedBtn props={{ icon: <LiaPlusSolid />, text: 'Lançamento' }} onClick={() => setModal('launch')} />
                </div>
            </div>

            <ul>
                {Object.keys(productAccounts).map(accountToken => (
                    <li key={accountToken}>
                        {productAccounts[accountToken].map(p => (
                            <Product key={p.codigo} product={p} account={accountToken} />
                        ))}
                    </li>
                ))}
            </ul>

            <LaunchModal accounts={accounts} productAccounts={productAccounts} deposits={deposits} id={id} sku={product.codigo} isOpen={modal === 'launch'} onClose={() => setModal('')} />

            <EditModal token={token} depositos={estoque.depositos} id={id} sku={product.codigo} isOpen={modal === 'edit'} onClose={() => setModal('')} />
        </div>
    );
}