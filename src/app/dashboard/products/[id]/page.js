'use client'
import { getProductById } from '@/service/productService';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMountainSun } from "react-icons/fa6";
import { MdArrowBackIos, MdEdit } from "react-icons/md";
import { LiaPlusSolid } from "react-icons/lia";

import LaunchModal from '@/components/LaunchModal';
import StylezedBtn from '@/components/StylezedBtn';
import { getEstoque } from '@/service/estoqueService';
import { AuthContext } from '@/context/AuthContext';
import EditModal from '@/components/EditModal';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { token, setToken } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [modal, setModal] = useState('');
    const [estoque, setEstoque] = useState([]);

    useEffect(() => {
        if (token) {
            getProductById(id, token).then((data) => {
                setProduct(data.data);
                console.log(data.data);
            }).catch((error) => {
                console.error('Erro ao obter o produto por id:', error);
            });
        }
    }, [id, token]);

    useEffect(() => {
        if (token) {
            getEstoque(id, token).then((data) => {
                console.log(data.data[0]);
                setEstoque(data.data[0]);
            }).catch((error) => {
                console.error('Erro ao obter estoques:', error);
            });
        }
    }, [id, token]);

    if (!product) {
        return (<div>Loading...</div>);
    }

    const imageUrl = product.midia?.imagens?.internas?.[0]?.link;

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
            <div className="my-4 flex flex-col justify-between align-middle border-gray-300 rounded-xl p-4 border-2">
                <div className=" m4 flex flex-col justify-between align-middle">
                    <h2 className="text-sm">#{product.codigo}</h2>
                    <h1 className="text-lg font-bold">{product.nome}</h1>
                </div>
                <div className="flex flex-col justify-between align-middle my-2 md:flex-row md:justify-between md:gap-4">
                    {imageUrl ? (<Image src={imageUrl} alt={product.nome} width={200} height={200} className='h-72 w-auto border-2 border-gray-300 rounded-lg object-cover md:h-40 md:w-40' />) : (
                        <div className="flex h-72 w-auto
                     border-2 border-gray-300 rounded-lg align-middle items-center justify-center md:h-40 md:w-40">
                            <FaMountainSun className="align-middle items-center justify-center" size={32} />
                        </div>
                    )}
                    <div className="flex flex-col align-middle w-full">
                        <h1 className="text-xl font-bold mt-6 md:mt-0">Detalhes do Produto</h1>
                        <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-1 items-center w-full">

                            <table className='hidden min-w-full divide-y divide-gray-300 md:table'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Código</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Marca</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Estoque</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Itens por Caixa</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Unidade</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-300'>
                                    <tr>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate'>{product.codigo}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate'>{product.marca}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate'>{product.estoque.saldoVirtualTotal}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate'>{product.itensPorCaixa}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate'>{product.unidade}</td>
                                    </tr>
                                </tbody>

                            </table>

                            <div className='w-full px-1 flex flex-col md:hidden justify-between'>
                                <div className="flex flex-col md:hidden">
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Código:</span>
                                        <span className="text-gray-900">{product.codigo}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Marca:</span>
                                        <span className="text-gray-900">{product.marca}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Estoque:</span>
                                        <span className="text-gray-900">{product.estoque.saldoVirtualTotal}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Itens por Caixa:</span>
                                        <span className="text-gray-900">{product.itensPorCaixa}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Unidade:</span>
                                        <span className="text-gray-900">{product.unidade}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <LaunchModal token={token} depositos={estoque.depositos} id={id} sku={product.codigo} isOpen={modal === 'launch'} onClose={() => setModal('') }/>

            <EditModal token={token} depositos={estoque.depositos} id={id} sku={product.codigo} isOpen={modal === 'edit'} onClose={() => setModal('') }/>
        </div>
    );
}