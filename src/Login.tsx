import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
          navigate("/home");
        

    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-black">
            {/* Logo goes here */}
            <div className="relative w-12 h-12 bg-blue-600 rounded-lg overflow-hidden flex items-end justify-end p-1 mb-4">
                <div className="w-full h-full border-b-2 border-r-2 border-white absolute bottom-1 right-1"></div>
                <div className="w-full h-[2px] bg-white absolute top-1/2 left-0"></div>
                <div className="w-[2px] h-full bg-white absolute top-0 right-1/4"></div>
            </div>

            {/* App title */}
            <h1 className="text-3xl font-bold tracking-tight mb-8">Blueprint</h1>

            {/* Google login button */}
            <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-3 w-72 bg-gray-100 hover:bg-gray-200 transition-colors py-2.5 rounded-md text-sm font-medium"
                >
                    {/* Google svg temporary */}
                </button>
        </div>
    );
}