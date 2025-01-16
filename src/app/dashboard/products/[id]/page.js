'use client'
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { use, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMountainSun } from "react-icons/fa6";
import { MdArrowBackIos, MdEdit } from "react-icons/md";
import { LiaPlusSolid } from "react-icons/lia";

import LaunchModal from '@/components/LaunchModal';
import StylezedBtn from '@/components/StylezedBtn';
import { AuthContext } from '@/context/AuthContext';
import EditModal from '@/components/EditModal';
import { getEstoqueQ, getProductByIdQ, getProductsQ, getUserQ } from '@/utils/requestQueue';
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

    useEffect(() => {
        if (accounts) {
            const fetchUsers = async () => {
                const usersData = [];
                for (const account of accounts) {
                    if (account.token) {
                        try {
                            const data = await getUserQ(account.token);
                            usersData.push(data.data);
                            console.log(data.data);
                        } catch (error) {
                            console.error('Erro ao obter usuarios:', error);
                        }
                    }
                }
                setUsers(usersData);
            };

            fetchUsers();
        }
    }, [accounts]);

    useEffect(() => {
        if (token) {
            getProductByIdQ(id, token).then((data) => {
                setProduct(data.data);
                console.log(data.data);
            }).catch((error) => {
                console.error('Erro ao obter o produto por id:', error);
            });
        }
    }, [id, token]);

    useEffect(() => {
        if (product) {
            const fetchProducts = async () => {
                const productsData = [];
                const accountsWithProduct = {};
                for (const account of accounts) {
                    if (account.token) {
                        try {
                            const data = await getProductsQ(1, 100, account.token, product.codigo);
                            const newProducts = data.data.filter(newProduct =>
                                !productsData.some(existingProduct => existingProduct.codigo === newProduct.codigo)
                            );
                            productsData.push(...newProducts);

                            if (newProducts.length > 0) {
                                accountsWithProduct[account.email] = newProducts;
                            }

                            console.log('produto: ', data);
                        } catch (error) {
                            console.error('Erro ao obter produtos:', error);
                        }
                    }
                }
                setAllProducts(productsData);
                setProductAccounts(accountsWithProduct);
            };

            fetchProducts();
        }
    }, [product, accounts]);

    console.log('Produtos: ', allProducts);
    console.log('Produto: ', product);
    console.log('Contas com produto: ', productAccounts);

    useEffect(() => {
        if (token) {
            getEstoqueQ(id, token).then((data) => {
                console.log(data.data[0]);
                setEstoque(data.data[0]);
            }).catch((error) => {
                console.error('Erro ao obter estoques:', error);
            });
        }
    }, [id, token]);

    if (!product) {
        return <div>Produto não encontrado</div>;
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
                {Object.keys(productAccounts).map(accountEmail => (
                    <li key={accountEmail}>
                        {productAccounts[accountEmail].map(p => (
                            <Product key={p.codigo} product={p} account={accountEmail} />
                        ))}
                    </li>
                ))}
            </ul>

            <LaunchModal token={token} depositos={estoque.depositos} id={id} sku={product.codigo} isOpen={modal === 'launch'} onClose={() => setModal('')} />

            <EditModal token={token} depositos={estoque.depositos} id={id} sku={product.codigo} isOpen={modal === 'edit'} onClose={() => setModal('')} />
        </div>
    );
}