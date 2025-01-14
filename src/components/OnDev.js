import { FaTools } from "react-icons/fa";

export default function OnDev() {
    return (
        <div className="flex justify-between align-middle border-2 border-gray-300 rounded-lg">
            <div className="flex flex-col items-center aling-middle w-full p-8 gap-3">
                <FaTools size={30} />
                <p className="justify-center items-center text-lg font-light text-center">Esta funcionalidade ainda esta em desenvolvimento.</p>
            </div>
        </div>
    );
}