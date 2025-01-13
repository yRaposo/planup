import NavBar from "@/components/NavBar";

export default function ProductsLayout({ children }) {
    return (
        <div>
            <NavBar />
            {children}
        </div>
    )
}