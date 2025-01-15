import React, { useState, useEffect, useContext } from 'react';
import { MdAccountCircle, MdClose } from 'react-icons/md';
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { IoMdExit } from "react-icons/io";
import StylezedBtn from './StylezedBtn';
import { getUser } from "@/service/userService";
import { AuthContext } from '@/context/AuthContext';

const AccountModal = ({ isOpen, onClose, account, isPrimary }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const { removeAccount, setAsPrimaryAccount } = useContext(AuthContext);

    useEffect(() => {
        if (account) {
            setLoading(true);
            getUser(account.token)
                .then((data) => {
                    setUser(data.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Erro ao obter Usuario:', error);
                    setLoading(false);
                });
        }
    }, [account]);

    if (!isOpen) return null;

    const handleRemoveAccount = () => {
        removeAccount(account.token);
        onClose();
    };

    const handleSetAsPrimary = () => {
        setAsPrimaryAccount(account.token, account.refresh_token);
        onClose();
    };

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full md:pt-60">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg">
                {loading ? (
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <MdAccountCircle className=" text-8xl" />
                        <h1 className="text-xl font-normal mt-2">{user?.email}</h1>
                        <h1 className="text-2xl font-bold">{user?.nome}</h1>
                    </div>
                )}

                <div className="flex flex-col justify-between mt-4 gap-2">
                    {!isPrimary && <StylezedBtn props={{ icon: <BsArrowUpRightCircleFill />, text: 'Usar Como Principal' }} onClick={handleSetAsPrimary} />}
                    <StylezedBtn props={{ icon: <IoMdExit />, text: 'Sair da conta' }} onClick={handleRemoveAccount} />
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={onClose} />
                </div>
            </div>
        </div>
    );
}

export default AccountModal;