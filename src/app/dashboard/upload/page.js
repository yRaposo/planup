import OnDev from "@/components/OnDev";

export default function Upload() {
    return (
        <div className="m-10 align-middle">
            <OnDev />

            <div className="flex justify-center">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center">
                        <input type="file" />
                    </div>
                    <div className="flex justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}