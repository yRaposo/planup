import { getUserQ } from "@/utils/requestQueue";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaMountainSun } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";

export default function Product({ product, account }) {

    const [user, setUser] = useState([]); 

    useEffect(() => {
        if(account) {
            getUserQ(account)
                .then((data) => {
                    setUser(data.data);
                })
        }
    })

    if (!product) {
        return <div>Produto não encontrado</div>;
    }

    const imageUrl = product.midia?.imagens?.internas?.[0]?.link;

    return (
        <>
            <div className="my-4 flex flex-col justify-between align-middle border-gray-300 rounded-xl p-4 border-2">
                <div className=" flex flex-col justify-between align-middle">
                    <div className=" flex flex-row justify-start gap-1 align-middle items-center">
                        <MdAccountCircle className=" text-xl" />
                        <h1 className="text-md font-thin">{user.nome}</h1>
                    </div>
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
        </>
    )
}