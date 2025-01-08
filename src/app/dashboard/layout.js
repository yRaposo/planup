import NavBar from "@/components/NavBar";

export default function homeLayout({ children }) {
    return (
        <div>
            <NavBar />
            {children}
        </div>
    )
}