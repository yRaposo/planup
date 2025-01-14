'use client'
import { getUser } from "@/service/userService";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdAccountCircle } from "react-icons/md";

export default function AccountBtn({ token, isPrimary }) {

    const [user, setUser] = useState([]);
    
    useEffect(() => {
        if (token) {
            getUser(token)
                .then((data) => {
                    setUser(data.data);
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Erro ao obter Contas:', error);
                })
        }
    }, [token]);

    return (
        <div>
            <Link href="" className=" flex flex-col border-2 border-gray-300 rounded-xl p-4 w-full  gap-4 align-middle items-center hover:bg-gray-100 md:justify-between md:flex-row relative">
            <div className="flex flex-col md:flex-row gap-4 align-middle items-center">
                <div>
                    <MdAccountCircle className=" text-8xl md:text-3xl" />
                </div>
                <div>
                    <h2 className="text-sm font-thin text-center md:text-left">{user.email}</h2>
                    <h1 className="text-lg font-bold text-center md:text-left">{user.nome}</h1>
                </div>
            </div>
                <div>
                    {isPrimary && (
                        
                        <div className="bg-gray-500 text-white rounded-md p-1 text-xs px-2 absolute top-2 right-2 md:static">
                            <p className="text-center font-bold"> 
                                Principal
                            </p>
                        </div>

                    )}
                </div>
            </Link>
        </div>
    );
}