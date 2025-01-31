'use client'
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import AccountBtn from "@/components/AccountBtn";
import AccountModal from "./AccountModal";
import { getUserQ } from "@/utils/requestQueue";

export default function AccountList() {

    const { token, accounts } = useContext(AuthContext);
    const [user, setUser] = useState([]);
    const [modal, setModal] = useState('');
    const [selectedAccount, setSelectedAccount] = useState({});


    const isPrimary = (account) => {
        if (token === account.token) {
            return true;
        } else {
            return false;
        }
    }

    const openModal = (account) => {
        setSelectedAccount(account);
        setModal('account');
    }

    return (
        <div className="align-middle flex flex-col gap-2">
            <h1 className="font-bold">Contas Ativas</h1>

            {accounts && accounts.length > 0 && accounts.map((account, index) => (
                <AccountBtn
                    key={index}
                    token={account.token}
                    email={account.email}
                    isPrimary={isPrimary(account)}
                    onClick={() => openModal(account, isPrimary)} />
            ))}

            <Link href="/access" className=" flex flex-row border-2 border-gray-300 rounded-xl p-4 w-full border-dashed justify-start gap-4 align-middle items-center hover:bg-gray-100">
                <div>
                    <CiCirclePlus size={30} />
                </div>
                <div>
                    <h1>Adicionar Conta</h1>
                </div>
            </Link>

            <AccountModal
                account={selectedAccount}
                isPrimary={isPrimary(selectedAccount)}
                isOpen={modal === 'account'}
                onClose={() => setModal('')} />
        </div>
    );
}