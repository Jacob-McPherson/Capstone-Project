import { supabase } from "./lib/supabase";

export default function Login() {
  const handleLogin = async () => {
    // Hardcode the redirect strictly for this test
    const redirectUrl = `${window.location.origin}/home`;
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: redirectUrl 
      }
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <button 
        onClick={handleLogin}
        style={{ padding: "1rem 2rem", fontSize: "1.2rem", cursor: "pointer" }}
      >
        Test Google Login
      </button>
    </div>
  );
}