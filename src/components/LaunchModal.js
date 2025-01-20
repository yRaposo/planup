'use client'
import { MdArrowBackIos, MdLaunch, MdClose } from "react-icons/md";
import StylezedBtn from "./StylezedBtn";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { postEstoqueQ } from "@/utils/requestQueue";

export default function LaunchModal({ accounts, productAccounts, isOpen, onClose, deposits }) {
    const [launchType, setLaunchType] = useState('B');
    const [selectedDeposits, setSelectedDeposits] = useState({});
    const [price, setPrice] = useState(0);
    const [cost, setCost] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [observations, setObservations] = useState('');
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [deposito, setDeposito] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [isIdEmpty, setIsIdEmpty] = useState(false);
    const [isSkuEmpty, setIsSkuEmpty] = useState(false);
    const [isDepositoEmpty, setIsDepositoEmpty] = useState(false);
    const [isLaunchTypeEmpty, setIsLaunchTypeEmpty] = useState(false);
    const [isQuantityEmpty, setIsQuantityEmpty] = useState(false);

    console.log('Depos:', deposits);

    if (!isOpen) return null;

    const handleLaunchTypeChange = (event) => {
        setLaunchType(event.target.value);
        setIsError(false);
    };

    const handleDepositoChange = (accountToken, event) => {
        const newSelectedDeposits = { ...selectedDeposits, [accountToken]: event.target.value };
        setSelectedDeposits(newSelectedDeposits); // Atualiza o estado com o depósito selecionado para a conta
        setIsError(false);
        console.log('Depositoaaaaaaaaaaa:', newSelectedDeposits);
        console.log('Depositos selecionados:', selectedDeposits);
    };

    const handleSubmit = async () => {
        setIsIdEmpty(Object.keys(productAccounts).some(accountToken => !productAccounts[accountToken].some(product => product.id)));
        setIsSkuEmpty(Object.keys(productAccounts).some(accountToken => !productAccounts[accountToken].some(product => product.codigo)));
        setIsDepositoEmpty(Object.values(selectedDeposits).some(deposito => !deposito));
        setIsQuantityEmpty(!quantity);

        if (Object.keys(productAccounts).some(accountToken => !productAccounts[accountToken].some(product => product.id)) ||
            Object.keys(productAccounts).some(accountToken => !productAccounts[accountToken].some(product => product.codigo)) ||
            Object.values(selectedDeposits).some(deposito => !deposito) ||
            !launchType || (launchType !== 'B' && !quantity)) {
            setIsError(true);
            setErrorType('Preencha todos os campos obrigatórios para realizar o lançamento.');
            return;
        }

        setIsProcessing(true);

        try {
            const promises = Object.keys(selectedDeposits).map(async (accountToken) => {
                const product = productAccounts[accountToken].find(product => product.id);
                const data = {
                    produto: {
                        id: product.id,
                        codigo: product.codigo
                    },
                    deposito: {
                        id: parseInt(selectedDeposits[accountToken]) // Substitua pelo ID do depósito correto
                    },
                    operacao: launchType,
                    preco: parseFloat(price),
                    custo: parseFloat(cost),
                    quantidade: parseFloat(quantity),
                    observacoes: observations
                };

                console.log('prédados:', data);
                console.log('Token:', accountToken);

                const response = await postEstoqueQ(data, accountToken);
                console.log('Estoque atualizado com sucesso:', response);
            });

            await Promise.all(promises);
            setIsError(false);
            onClose(); // Fechar o modal após o sucesso
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
            if (error.response) {
                console.error('Resposta:', error.response.data);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full md:pt-60">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Novo Lançamento</h1>
                    <label className="text-sm">Tipo de Lançamento</label>
                    <select value={launchType} onChange={handleLaunchTypeChange} className={`w-full p-2 mt-2 mb-2 border  rounded-full appearance-none" + ${isLaunchTypeEmpty ? 'border-red-800' : 'border-gray-300'}`}>
                        <option value="E">Entrada</option>
                        <option value="B" selected>Balanço</option>
                        <option value="S">Saída</option>
                    </select>

                    <label className="text-sm mt-2">Depósito</label>
                    <div className="border border-gray-300 rounded-xl p-4 mt-2">
                        {deposits && Object.keys(deposits).map(accountToken => {
                            const account = accounts.find(acc => acc.token === accountToken);
                            return (
                                <div className="mt-2" key={accountToken}>
                                    <h3>{account ? account.email : 'Conta não encontrada'}</h3>
                                    <select value={selectedDeposits[accountToken] || ''} onChange={(e) => handleDepositoChange(accountToken, e)} className={`w-full p-2 mt-1 border rounded-full appearance-none ${isDepositoEmpty ? 'border-red-800' : 'border-gray-300'}`}>
                                        <option value="" disabled hidden>Selecione um depósito</option>
                                        {deposits[accountToken].map(dep => (
                                            <option key={dep.id} value={dep.id}>{dep.descricao}</option>
                                        ))}
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                    
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
                            <input type="number" placeholder="0" className={`w-full p-2 mt-2 border  rounded-full " + ${isQuantityEmpty ? 'border-red-800' : 'border-gray-300'}`} value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                            <label className="text-sm">Preço de Custo</label>
                            <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={cost} onChange={(e) => setCost(e.target.value)} />

                            <label className="text-sm">Observação</label>
                            <input type="text" placeholder="" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={observations} onChange={(e) => setObservations(e.target.value)} />
                        </div>
                    ) : (
                        <div>
                            <label className="text-sm">Quantidade</label>
                            <input type="number" placeholder="0" className={`w-full p-2 mt-2 border  rounded-full " + ${isQuantityEmpty ? 'border-red-800' : 'border-gray-300'}`} value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                            <label className="text-sm">Preço de Venda</label>
                            <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={price} onChange={(e) => setPrice(e.target.value)} />

                            <label className="text-sm">Observação</label>
                            <input type="text" placeholder="" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={observations} onChange={(e) => setObservations(e.target.value)} />
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={onClose} />
                    <StylezedBtn props={{ icon: isProcessing ? (<CgSpinner className="animate-spin" />) : (<MdLaunch />), text: 'Lançar' }} onClick={() => handleSubmit()} />
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