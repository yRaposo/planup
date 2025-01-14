import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";

export default function AcountList() {
    return (
        <div className="align-middle flex flex-col gap-2">
            <h1 className="font-bold">Contas Ativas</h1>
            
            <Link href="" className=" flex flex-row border-2 border-gray-300 rounded-xl p-4 w-full border-dashed justify-start gap-4 align-middle items-center hover:bg-gray-100">
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