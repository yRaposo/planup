'use client';
import StylezedBtn from "@/components/StylezedBtn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PiPackageFill } from "react-icons/pi";
import { MdAccountCircle, MdCloudUpload } from "react-icons/md";

export default function Dashboard() {

    const router = useRouter();

    return (
        <div className="mx-auto my-auto flex flex-col items-center">
            <Image src="/U.svg" alt="PlanUp" width={150} height={150} className="object-cover text-gray-800" />
            <h2 className="my-2 text-2xl font-thin text-center">Bem-vindo ao PlanUp</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full max-w-4xl">
                <div className="flex flex-col gap-4 md:border-r-2 border-gray-300 p-4">
                    <StylezedBtn props={{ icon: <PiPackageFill />, text: 'Buscar Produtos' }} onClick={() => { router.push('/dashboard/products') }} />
                    <p>Gerencie seu estoque ou edite produtos registrados na sua conta principal.</p>
                </div>
                <div className="flex flex-col gap-4 p-4">
                    <StylezedBtn props={{ icon: <MdCloudUpload />, text: 'Upload via .csv' }} onClick={() => { router.push('/dashboard/upload') }} />
                    <p>Atualize o estoque de produtos de forma rápida e prática usando uma planilha em .csv.</p>
                </div>
                <div className="flex flex-col gap-4 md:border-l-2 border-gray-300 p-4">
                    <StylezedBtn props={{ icon: <MdAccountCircle />, text: 'Gerenciar Perfis' }} onClick={() => { router.push('/dashboard/profile') }} />
                    <p>Gerencie diferentes perfis de usuário de forma eficiente e organizada fazendo login em múltiplas contas.</p>
                </div>
            </div>
        </div>
    )
}