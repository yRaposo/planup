'use client';
import Link from "next/link";
import { MdHomeFilled, MdAccountCircle } from "react-icons/md";
import { PiPackageFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { getUser } from "@/service/userService";
import { useRouter } from "next/navigation";


export default function NavBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState([]);
    const [token, setToken] = useState(null);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        getUser(token)
            .then((data) => {
                console.log(data);
                setUser(data);
            })
            .catch((error) => {
                console.error(error);
            })
    }, [token]);

    return (
        <div className="bg-white text-gray-800 m-4 p-4 rounded-2xl border-2 border-gray-300 flex justify-between align-middle">
            <div>
                <h1 className="text-2xl font-black">PlanUp</h1>
            </div>
            <div className="flex gap-4 align-middle">
                <Link href="/dashboard">
                    <MdHomeFilled className="text-3xl" />
                </Link>
                <Link href={`/products`}>
                    <PiPackageFill className="text-3xl" />
                </Link>
                <div className="relative">
                    <button onClick={toggleDropdown}>
                        <MdAccountCircle className="text-3xl" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                            <div className="flex flex-col gap-0 border-b border-gray-300">
                                <div className="px-4 pt-2 pb-0 text-gray-800 text-xs">
                                    {user.data.email}
                                </div>
                                <div className="px-4 pb-2 text-gray-800 text-xs font-black">
                                    {user.data.nome}
                                </div>

                            </div>
                            <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                Gerenciar Perfis
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}