// import { useNavigate } from "react-router-dom"; code no longer needed will be left as comment instead of complete deletion
// import TextType from "./lib/TextType";
import {supabase} from "./lib/supabase";

export default function Login() { 
  //const navigate = useNavigate();

  // we will replace this with the actual Supabase Google OAuth
 // const handleLogin = () => {
   // navigate("/home");
  //};
// switching page to home, no longer needed

const handleLogin = async () => {
  // console.log('redirectUrl:', redirectUrl); // added for testing
  await supabase.auth.signInWithOAuth({
   provider: "google",
   options: { redirectTo: `${window.location.origin}/home` },
  });
};

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-black">
        {/* Logo Icon (placeholder too) */}
        <div className="relative w-12 h-12 bg-blue-600 rounded-lg overflow-hidden flex items-end justify-end p-1 mb-4">
          <div className="w-full h-full border-b-2 border-r-2 border-white absolute bottom-1 right-1"></div>
          <div className="w-full h-[2px] bg-white absolute top-1/2 left-0"></div>
          <div className="w-[2px] h-full bg-white absolute top-0 right-1/4"></div>
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold tracking-tight mb-8">Blueprint</h1>

        {/* Google Login Button */}
        <button 
          onClick={handleLogin}
          className="hidden md:flex items-center justify-center gap-3 w-84 bg-gray-100 hover:bg-gray-200 transition-colors py-2.5 rounded-md text-sm font-medium"
        >
          {/* Simple Google G SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
            <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
            <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
            <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
          </svg>
          Continue with Google
        </button>

        {/* Or Divider */}
        <div className="flex items-center gap-3 w-72 mt-6 mb-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-500 text-sm">Or</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Terms Text */}
        <p className="text-xs text-gray-500 max-w-[260px] text-center mt-12">
          By clicking continue, you agree to our <span className="font-semibold text-gray-700">Terms of Service</span> and <span className="font-semibold text-gray-700">Privacy Policy</span>
        </p>
      </div>
  
  );
}