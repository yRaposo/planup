'use client'
import { MdArrowBackIos, MdLaunch, MdClose } from "react-icons/md";
import StylezedBtn from "./StylezedBtn";
import { useState } from "react";
import { postEstoque } from "@/service/estoqueService";

export default function LaunchModal({ isOpen, onClose, id, sku, token, depositos }) {
    const [launchType, setLaunchType] = useState('B');
    const [price, setPrice] = useState(0);
    const [cost, setCost] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [observations, setObservations] = useState('');
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [deposito, setDeposito] = useState('');

    const [isIdEmpty, setIsIdEmpty] = useState(false);
    const [isSkuEmpty, setIsSkuEmpty] = useState(false);
    const [isDepositoEmpty, setIsDepositoEmpty] = useState(false);
    const [isLaunchTypeEmpty, setIsLaunchTypeEmpty] = useState(false);

    if (!isOpen) return null;

    const handleLaunchTypeChange = (event) => {
        setLaunchType(event.target.value);
    };

    const handleDepositoChange = (event) => {
        console.log(event.target.value);
        setDeposito(event.target.value);
    };

    const handleSubmit = async () => {

        setIsIdEmpty(!id);
        setIsSkuEmpty(!sku);
        setIsDepositoEmpty(!deposito);

        if (!id || !sku || !deposito || !launchType ) {
            setIsError(true);
            setErrorType('Preencha todos os campos obrigatórios para realizar o lançamento.');
            return;
        }

        const data = {
            produto: {
                id: id,
                codigo: sku
            },
            deposito: {
                id: parseInt(deposito) // Substitua pelo ID do depósito correto
            },
            operacao: launchType,
            preco: parseFloat(price),
            custo: parseFloat(cost),
            quantidade: parseFloat(quantity),
            observacoes: observations
        };

        console.log('prédados:', data);
        console.log('Token:', token);

        try {
            const response = await postEstoque(data, token);
            console.log('Estoque atualizado com sucesso:', response);
            onClose();
        } catch (error) {
            setIsError(true);

            if (error.response) {
                // Erros de resposta do servidor
                if (error.response.status === 400) {
                    setErrorType('Requisição inválida. Verifique os dados e tente novamente.');
                } else if (error.response.status === 401) {
                    setErrorType('Não autorizado. Faça login e tente novamente.');
                } else if (error.response.status === 404) {
                    setErrorType('Recurso não encontrado. Verifique o ID e tente novamente.');
                } else if (error.response.status === 500) {
                    setErrorType('Erro interno do servidor. Tente novamente mais tarde.');
                } else {
                    setErrorType('Erro desconhecido. Tente novamente.');
                }
            } else if (error.request) {
                // Erros de requisição (sem resposta do servidor)
                setErrorType('Sem resposta do servidor. Verifique sua conexão e tente novamente.');
            } else {
                // Outros erros
                setErrorType('Erro ao atualizar estoque. Tente novamente.');
            }

            console.error('Erro ao atualizar estoque:', error);
        }
    }

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full md:pt-60">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Novo Lançamento</h1>
                    <label className="text-sm">Tipo de Lançamento</label>
                    <select value={launchType} onChange={handleLaunchTypeChange} className={`w-full p-2 mt-2 border  rounded-full " + ${isLaunchTypeEmpty ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="E">Entrada</option>
                        <option value="B" selected>Balanço</option>
                        <option value="S">Saída</option>
                    </select>

                    <label className="text-sm">Depoisito</label>
                    <select value={deposito} onChange={handleDepositoChange} className={`w-full p-2 mt-2 border  rounded-full " + ${isDepositoEmpty ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="" disabled hidden>Selecione um depósito</option>
                        {depositos.map((dep) => (
                            <option key={dep.id} value={dep.id}>{dep.id}</option>
                        ))}
                    </select>
                </div>

                <div className="mt-4">
                    {launchType === 'B' ? (<div>
                        <label className="text-sm">Quantidade</label>
                        <input type="number" placeholder="0" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                        <label className="text-sm">Preço de Compra</label>
                        <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={price} onChange={(e) => setPrice(e.target.value)} />

                        <label className="text-sm">Preço de Custo</label>
                        <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={cost} onChange={(e) => setCost(e.target.value)} />

                        <label className="text-sm">Observação</label>
                        <input type="text" placeholder="" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={observations} onChange={(e) => setObservations(e.target.value)} />
                    </div>) : launchType === 'E' ? (
                        <div>
                            <label className="text-sm">Quantidade</label>
                            <input type="number" placeholder="0" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                            <label className="text-sm">Preço de Custo</label>
                            <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={cost} onChange={(e) => setCost(e.target.value)} />

                            <label className="text-sm">Observação</label>
                            <input type="text" placeholder="" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={observations} onChange={(e) => setObservations(e.target.value)} />
                        </div>
                    ) : (
                        <div>
                            <label className="text-sm">Quantidade</label>
                            <input type="number" placeholder="0" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                            <label className="text-sm">Preço de Venda</label>
                            <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={price} onChange={(e) => setPrice(e.target.value)} />

                            <label className="text-sm">Observação</label>
                            <input type="text" placeholder="" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={observations} onChange={(e) => setObservations(e.target.value)} />
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={onClose} />
                    <StylezedBtn props={{ icon: <MdLaunch />, text: 'Lançar' }} onClick={() => handleSubmit()} />
                </div>

                <div className="mt-4">
                    {isError && (
                        <div className="bg-red-200 text-red-800 p-2 rounded-xl">
                            {errorType}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}