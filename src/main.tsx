import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import "./i18n"; // i18n import

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(<App />);
