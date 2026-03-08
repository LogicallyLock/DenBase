import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { checkSupabaseEnv } from "@/integrations/supabase/env-check";

checkSupabaseEnv();

createRoot(document.getElementById("root")!).render(<App />);
