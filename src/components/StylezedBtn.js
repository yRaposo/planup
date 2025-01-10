export default function StylezedBtn({ props, onClick }) {
    return (
        <button onClick={onClick} className="flex gap-2 bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-full border-2 border-gray-300">
            {props.icon ? <div className="my-auto">
                {props.icon}
            </div> : null}
            {props.text ? <div>
                {props.text}
            </div> : null}
        </button>
    )
}