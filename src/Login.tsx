// import { useNavigate } from "react-router-dom"; code no longer needed will be left as comment instead of complete deletion
import TextType from "./lib/TextType";
import { supabase } from "./lib/supabase";

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/home` },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left side: Hero text and typewriter animation */}
        <div className="hidden md:flex flex-col items-start justify-center pr-8">
          <h2 className="text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            Welcome to Blueprint Quest Manager
          </h2>

          {/* wrap textype in fixed height div so page doesnt jump up and down so whoever reads this dont change it */}
          <div className="text-3xl font-medium text-blue-600 h-20">
            <TextType
              text={[
                "Your ultimate student dashboard",
                "Organize your tasks and deadlines",
                "Gamify your productivity journey",
                "One thing at a time, one quest at a time",
              ]}
              typingSpeed={60}
              deletingSpeed={40}
              pauseDuration={2500}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-gray-400"
            />
          </div>
        </div>

        {/* Right side login card and show items in rows*/}
        <div className="bg-white p-10 sm:p-12 rounded-3xl shadow-xl flex flex-col items-center justify-center max-w-md mx-auto w-full border border-gray-100">

          <svg className="w-20 h-20 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path d="M23 3.5V30" stroke="white" strokeWidth="2" />
            <path d="M4 25H29.75" stroke="white" strokeWidth="2" />
          </svg>

          {/* App Name */}
          <h1 className="text-4xl font-bold tracking-tight mb-8">Blueprint</h1>

          {/* Google Login Button */}
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-3 w-full bg-gray-100 hover:bg-gray-200 transition-colors py-3.5 rounded-xl text-base font-medium text-gray-800"
          >
            {/* Simple Google G SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
              <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
              <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
              <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
            </svg>
            Continue with Google
          </button>

          {/* Terms Text */}
          <p className="text-xs text-gray-500 max-w-[260px] text-center mt-12">
            By clicking continue, you agree to our <span className="font-semibold text-gray-700">Terms of Service</span> and <span className="font-semibold text-gray-700">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>

  );
}