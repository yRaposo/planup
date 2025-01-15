'use client'
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import AccountBtn from "@/components/AccountBtn";
import { getUser } from "@/service/userService";

export default function AccountList() {

    const { token, accounts } = useContext(AuthContext);
    const [user, setUser] = useState([]);

    useEffect(() => {
        if (token) {
            getUser(token)
                .then((data) => {
                    setUser(data.data);
                })
                .catch((error) => {
                    console.error('Erro ao obter Usuario:', error);
                })
        }
    }, [token]);

    const isPrimary = (account) => {
        if (user.email === account.email) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className="align-middle flex flex-col gap-2">
            <h1 className="font-bold">Contas Ativas</h1>

            {accounts && accounts.length > 0 && accounts.map((account, index) => (
                <AccountBtn key={index} token={account.token} email={account.email} isPrimary={isPrimary(account)} />
            ))}

            <Link href="/addAccount" className=" flex flex-row border-2 border-gray-300 rounded-xl p-4 w-full border-dashed justify-start gap-4 align-middle items-center hover:bg-gray-100">
                <div>
                    <CiCirclePlus size={30} />
                </div>
                <div>
                    <h1>Adicionar Conta</h1>
                </div>
            </Link>
        </div>
    );
}