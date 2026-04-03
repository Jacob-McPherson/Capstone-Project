import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/home");
      }
    });
  }, [navigate]);

  return <div>Signing you in...</div>;
}