'use client'
import { MdArrowBackIos, MdLaunch, MdClose } from "react-icons/md";
import StylezedBtn from "./StylezedBtn";
import { useState } from "react";

export default function LaunchModal({ isOpen, onClose }) {
    const [launchType, setLaunchType] = useState('B');
    if (!isOpen) return null;

    const handleLaunchTypeChange = (event) => {
        setLaunchType(event.target.value);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Novo Lançamento</h1>
                    <label className="text-sm">Tipo de Lançamento</label>
                    <select value={launchType} onChange={handleLaunchTypeChange} className="w-full p-2 mt-2 border border-gray-300 rounded-full">
                        <option value="E">Entrada</option>
                        <option value="B" selected>Balanço</option>
                        <option value="S">Saída</option>
                    </select>
                </div>

                <div className="mt-4">
                    {launchType === 'B' ? (<div>
                        <label className="text-sm">Quantidade</label>
                        <input type="number" placeholder="0" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />

                        <label className="text-sm">Preço de Compra</label>
                        <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />

                        <label className="text-sm">Preço de Custo</label>
                        <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />

                        <label className="text-sm">Observação</label>
                        <input type="text" placeholder="" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />
                    </div>) : launchType === 'E' ? (
                        <div>
                            <label className="text-sm">Quantidade</label>
                            <input type="number" placeholder="0" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />

                            <label className="text-sm">Preço de Custo</label>
                            <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />

                            <label className="text-sm">Observação</label>
                            <input type="text" placeholder="" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />
                        </div>
                    ) : (
                        <div>
                            <label className="text-sm">Quantidade</label>
                            <input type="number" placeholder="0" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />

                            <label className="text-sm">Preço de Venda</label>
                            <input type="number" placeholder="0,00" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />

                            <label className="text-sm">Observação</label>
                            <input type="text" placeholder="" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" />
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={onClose} />
                    <StylezedBtn props={{ icon: <MdLaunch />,text: 'Lançar' }} onClick={onClose} />
                </div>

            </div>
        </div>
    )
}