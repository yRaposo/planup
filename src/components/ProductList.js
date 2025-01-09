'use client'
import { getProducts } from "@/service/productService";
import { useState, useEffect } from "react";
import { MdFilterAlt, MdOutlineClear } from "react-icons/md";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { truncateText } from "@/utils/truncateText";
import { useRouter } from "next/navigation";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(null);
    const [page, setPage] = useState(1);
    const [sku, setSku] = useState('');
    const [isInputActive, setIsInputActive] = useState(false);
    const [isempty, setIsEmpty] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            getProducts(page, 100, token, sku)
                .then((result) => {
                    if (Array.isArray(result.data)) {
                        setProducts(result.data);
                    } else {
                        console.error('Resposta no formato errado:', result);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [token, page, sku]);

    const handleRowClick = (id) => {
        router.push(`dashboard/products/${id}`);
    }

    const handleInputChange = (event) => {
        setSku(event.target.value);
        setPage(1);
        if (event.target.value === '') {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    }

    const handleInputFocus = () => {
        setIsInputActive(true);
    };

    const handleInputBlur = () => {
        setIsInputActive(false);
    };

    return (
        <div className="flex flex-col items-center aling-middle w-full">
            <h1 className="justify-center items-center text-4xl font-bold text-center">Busque por um produto</h1>

            <div className="flex w-full gap-5">
                <div className={`flex border-2 border-gray-300 rounded-3xl p-2 w-full mt-5 justify-around ${isInputActive ? 'border-gray-800' : 'border-gray-300'}`}>
                    <input type="text" className="w-full outline-none" placeholder="Digite o SKU do produto" value={sku} onChange={handleInputChange} onFocus={handleInputFocus}
                        onBlur={handleInputBlur}/>
                    {isempty ? null : (
                        <button className="text-white rounded-xl align-middle items-center" onClick={() => {
                            setSku('');
                            setIsEmpty(true);
                        }}>
                            <MdOutlineClear  color="#000" size="20" />
                        </button>
                    )}
                </div>

                <button className="flex border-2 border-gray-300 rounded-3xl p-3 mt-5 justify-around align-middle items-center">
                    <MdFilterAlt color="#000" size="20" />
                </button>

                <div className="flex border-2 border-gray-300 rounded-3xl p-2 mt-5 justify-around gap-3">
                    <button onClick={() => {
                        if (page > 1) {
                            setPage(page - 1);
                        }
                    }} className="text-white rounded-xl align-middle items-center">
                        <IoMdArrowDropleft color="#000" size="20" />
                    </button>
                    <p className="text-center">{page}</p>
                    <button onClick={() => {
                        setPage(page + 1);
                    }} className="text-white rounded-xl align-middle items-center">
                        <IoMdArrowDropright color="#000" size="20" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-5 items-center w-full">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Preço</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {products.map((product) => {
                            if (product && product.id) {
                                return (
                                    <tr key={product.id} onClick={() => handleRowClick(product.id)} className="cursor-pointer hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate hidden md:table-cell">{truncateText(product.nome, 40)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">{product.codigo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate hidden md:table-cell">R${product.preco}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">{product.estoque.saldoVirtualTotal}</td>
                                    </tr>
                                );
                            } else {
                                console.error('Produto no formato errado:', product);
                                return null;
                            }
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    );
}